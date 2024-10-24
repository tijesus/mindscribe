import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import posts from '../../data/Posts.json'; // Import the JSON data
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const post = posts.find(p => p.id === parseInt(id));
  
    // State management for likes, bookmarks, and comments
    const [likes, setLikes] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
  
    if (!post) {
      return <div>Post not found</div>;
    }
  
    // Like handler
    const handleLike = () => {
      setLikes(likes + 1);
    };
  
    // Bookmark handler
    const handleBookmark = () => {
      setIsBookmarked(!isBookmarked);
    };
  
    // Comment submission handler
    const handleCommentSubmit = (e) => {
      e.preventDefault();
      if (newComment.trim()) {
        setComments([...comments, newComment]);
        setNewComment(''); // Clear the input field after submission
      }
    };
  
    return (
      <div className="post-detail">
        {/* Post Image */}
        <div className="post-image-container">
          <img src={post.image} alt={post.title} className="post-image" />
        </div>
  
        {/* Post Title */}
        <h1>{post.title}</h1>
  
        {/* Author and Category */}
        <div className="author">
          <img src={post.authorPic} alt={post.author} className="author-pic" />
          <div className="author-name">{post.author}</div>
        </div>
        <div className="category">{post.category}</div>
  
        {/* Post Content */}
        <p>{post.content}</p>
  
 
        {/* Post Metadata */}
        <div className="metadata">
          <span>Published: {post.published_date}</span>
          <span>Reading Time: {post.reading_time}</span>
        </div>
  
        {/* Like, Bookmark, and Comment functionalities */}
        <div className="post-actions">
          <button className="like-button" onClick={handleLike}>
            👍 {likes} {likes === 1 ? 'Like' : 'Likes'}
          </button>
          <button className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`} onClick={handleBookmark}>
            {isBookmarked ? '🔖 Bookmarked' : '📑 Bookmark'}
          </button>
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
  
          {/* Display comments */}
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