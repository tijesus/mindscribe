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
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null); // Post state
  const [comments, setComments] = useState([]); // Comments state
  const [newComment, setNewComment] = useState(""); // New comment input state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the post data from the API
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${id}`);
        console.log("Fetched post:", response); // Log the response for debugging
        setPost(response); // Set the post data
      } catch (err) {
        console.error("Error fetching post:", err); // Log error
        setError("Failed to load post. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post && post.content) {
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
      });
    }
  }, [post]);


  // Handle new comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment(""); // Clear the comment input
    }
  };

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
        <h3>Comments ({comments.length})</h3>
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
          {comments.map((comment, index) => (
            <li key={index} className="comment-item">
              {comment}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostDetail;