import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postsData from '../../data/Posts.json'; // Import your JSON data here
import './Blog.css'; // Your CSS for the blog page

const Blog = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load posts from posts.json or your API
  useEffect(() => {
    setPosts(postsData); // Replace with API call if needed
  }, []);

  // Filter posts only if search query is entered, otherwise show all posts
  const filteredPosts = searchQuery
    ? posts.filter(post => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(lowerCaseQuery) ||
          post.content.toLowerCase().includes(lowerCaseQuery)
        );
      })
    : posts; // When searchQuery is empty, show all posts

  return (
    <div className="blog-page">
      {/* Add a console log to check if the user is passed */}
      {console.log('User:', user)}

      {/* Search and Create Post Section */}
      <div className="top-section">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        {/* Top-right "Create Post" button, visible only if the user is logged in */}
        {user ? (
          <div className="create-post-button">
            <Link to="/create-post">Create Post</Link>
          </div>
        ) : (
          <p>Please log in to create a post.</p>
        )}
      </div>

      {/* Display all posts or filtered posts based on search query */}
      <div className="posts-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-image-container">
                <img src={post.image} alt={post.title} className="post-image" />
              </div>
              <div className="post-content">
                <h2>{post.title}</h2>
                <div className="post-meta">
                  <div className="author-info">
                    <img src={post.authorPic} alt={post.author} className="author-pic" />
                    <span>{post.author}</span>
                  </div>
                  <div className="post-timestamp">
                    <span>Published: {post.published_date}</span>
                    <span>Reading Time: {post.reading_time}</span>
                  </div>
                </div>
                <p>{post.content}</p>
                <div className="post-actions">
                  <Link to={`/posts/${post.id}`} className="read-more-button">Read More</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='no-post'>No posts found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
