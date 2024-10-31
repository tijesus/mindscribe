import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/requests";
import "./PostDetail.css";
import { BarLoader } from "react-spinners";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import LikeButton from "./LikeButton.js";
import BookmarkButton from "./BookmarkButton.js";

const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const PostDetail = ({ user }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [meta, setMeta] = useState(null); // Pagination metadata
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const limit = 10; // Set the limit for comments per page
  const [commentCount, setCommentCount] = useState(0);

  // Fetch post details and comments on load and when page changes
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${id}`);
        setPost(response);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async (page = 1) => {
      try {
        const response = await axiosInstance.get(`/posts/${id}/comments/?limit=${limit}&page=${page}`);
        setCommentCount(response.data.length);
        setComments(response.data); // Set comments directly from the response
        setMeta(response.meta); // Update pagination metadata
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchPost();
    fetchComments(currentPage); // Fetch comments for current page
  }, [id, currentPage]);

  useEffect(() => {
    if (post && post.content) {
      document.querySelectorAll("pre").forEach((block) => {
        hljs.highlightBlock(block);
      });
    }
  }, [post]);

const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (newComment.trim()) {
    try {
      console.log("Submitting comment");

      // Using fetch to post the new comment
      const response = await fetch(
        `https://mindscribe.praiseafk.tech/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );

      // Check if response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newCommentData = await response.json(); // Parse response JSON
      console.log("Comment response:", newCommentData); // Log comment data

      // Fetch user details using the user ID from the comment
      const userResponse = await fetch(
        `https://mindscribe.praiseafk.tech/users/${newCommentData.userId}`
      );
      if (!userResponse.ok) {
        throw new Error(`User fetch error! Status: ${userResponse.status}`);
      }

      const userDetails = await userResponse.json(); // Parse user response JSON
      console.log("User response:", userDetails); // Log user details

      // Create a complete comment object with user details
      const newCommentWithUser = {
        ...newCommentData,
        user: userDetails,
      };

      // Update comments state with the new comment
      setComments((prevComments) => [newCommentWithUser, ...prevComments]);
      setCommentCount((prevCount) => prevCount + 1);

      // Reset form state
      setNewComment("");
      setCommentError(null);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentError(
        err.message.includes("409")
          ? "You've already commented on this post."
          : "Failed to submit comment. Please try again."
      );
    }
  }
};



  // Pagination handlers
  const goToPreviousPage = () => setCurrentPage((prev) => prev - 1);
  const goToNextPage = () => setCurrentPage((prev) => prev + 1);

  if (loading)
    return (
      <div style={center}>
        <BarLoader color={"#000"} loading={loading} size={50} />
      </div>
    );
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="post-detail">
      {/* Post Image */}
      <div className="post-image-container">
        <img src={post.bannerUrl} alt={post.title} className="post-image" />
      </div>

      {/* Post Title */}
      <h1>{post.title}</h1>

      {/* Post Metadata */}
      <div className="metadata">
        <span>Published: {new Date(post.createdAt).toLocaleDateString()}</span>
        <span>Reading Time: {post.readTime} min</span>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="post-content-html"
      />

      {/* Post Actions */}
      <div className="post-actions">
        <LikeButton postId={post.id} user={user} />
        <BookmarkButton postId={post.id} user={user} />
      </div>

      {/* Comment Section */}
      <div className="comment-section">
        <h3>Comments ({commentCount})</h3>

        {/* Display comment error message */}
        {commentError && <div className="comment-error">{commentError}</div>}

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
          />
          <button type="submit" className="comment-submit">
            Submit
          </button>
        </form>

        {/* Display Comments */}
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <strong>{`${comment.user.firstname} ${comment.user.lastname}`}</strong>{" "}
              {/* Access username from user object */}
              <p>{comment.comment}</p>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            onClick={goToPreviousPage}
            disabled={!meta?.hasPreviousPage}
            className="pagination-button"
          >
            Previous
          </button>
          {/* <span className="pagination-info">
            Page {meta?.page} of {meta?.totalPages}
          </span> */}
          <button
            onClick={goToNextPage}
            disabled={!meta?.hasNextPage}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
