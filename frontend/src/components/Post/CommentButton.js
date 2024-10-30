// CommentButton.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./CommentButton.css";

const CommentButton = ({ postId, user }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`https://mindscribe.praiseafk.tech/posts/${postId}/comments`);
      if (Array.isArray(response.data.data)) {
        const commentsWithUsernames = await Promise.all(response.data.data.map(async (comment) => {
          const userResponse = await axios.get(`https://mindscribe.praiseafk.tech/users/${comment.userId}`);
          return {
            ...comment,
            username: userResponse.data.username,
          };
        }));
        setComments(commentsWithUsernames);
      } else {
        console.error("Comments data is not an array.");
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments.");
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);

    const existingComment = comments.find(comment => comment.userId === user.id);

    if (existingComment) {
      alert("You can only leave one comment per post.");
      setLoading(false);
      return;
    }

    const payload = {
      comment: newComment,
    };

    try {
      const response = await axios.post(
        `https://mindscribe.praiseafk.tech/posts/${postId}/comments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setComments((prevComments) => [
        ...prevComments,
        { ...response.data, username: user.username }
      ]);

      setNewComment(""); // Clear the comment input
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      console.log("Attempting to edit comment with ID:", editCommentId);
      console.log("Payload for editing comment:", { comment: editContent });
      
      await axios.put(
        `https://mindscribe.praiseafk.tech/posts/${postId}/comments/${editCommentId}`,
        { comment: editContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      ).catch(error => {
        console.error("Error editing comment:", error.response ? error.response.data : error.message);
      });
      

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === editCommentId ? { ...comment, comment: editContent } : comment
        )
      );
      setEditCommentId(null);
      setEditContent('');
    } catch (error) {
      console.error("Error editing comment:", error);
      setError("Failed to edit comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`https://mindscribe.praiseafk.tech/posts/${postId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={editCommentId ? handleEditSubmit : handleCommentSubmit}>
        <input
          type="text"
          value={editCommentId ? editContent : newComment}
          onChange={(e) => editCommentId ? setEditContent(e.target.value) : setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : editCommentId ? 'Edit Comment' : 'Submit Comment'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <p>{comment.comment}</p>
            <small>By: {comment.username} at {new Date(comment.createdAt).toLocaleString()}</small>
            {user.id === comment.userId && (
              <div>
                <button onClick={() => { setEditCommentId(comment.id); setEditContent(comment.comment); }}>Edit</button>
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentButton;