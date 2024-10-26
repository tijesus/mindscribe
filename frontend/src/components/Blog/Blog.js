import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiEngine from '../../api/requests'; 
import './Blog.css'; 

const Blog = ({ user }) => {
  const [posts, setPosts] = useState([]); // State to hold posts
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Load posts from the API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await apiEngine.get('https://mindscribe.praiseafk.tech/posts/?page=1&limit=10'); // Use the provided URL for fetching posts
        console.log('Posts fetched:', response.data); // Log the entire response data for debugging

        // Log the structure of the response for debugging
        console.log('Response structure:', JSON.stringify(response.data, null, 2));

        // Assuming the posts are directly in response.data
        if (response.data && Array.isArray(response.data)) { // Adjust if your API structure is different
          setPosts(response.data); // Set posts state with the fetched data
        } else {
          setError('Unexpected data structure received.'); // Set error for unexpected structure
        }
      } catch (error) {
        console.error('Error fetching posts:', error); // Log the error
        setError('Failed to load posts. Please try again later.'); // Set error message for user
      } finally {
        setLoading(false); // Set loading to false after attempt
      }
    }
    fetchPosts();
  }, []);

  // Filter posts based on the search query
  const filteredPosts = searchQuery
    ? posts.filter(post => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(lowerCaseQuery) ||
          post.content.toLowerCase().includes(lowerCaseQuery)
        );
      })
    : posts; // Show all posts when searchQuery is empty

  return (
    <div className="blog-page">
      {console.log('User:', user)} {/* Log the user for debugging */}

      {/* Loading Indicator */}
      {loading && <p>Loading posts...</p>} {/* Show loading text if loading is true */}
      
      {/* Error Message */}
      {error && <p className="error-message">{error}</p>} {/* Display error message if present */}

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
        {filteredPosts.length > 0 ? ( // Check if there are posts to display
          filteredPosts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-image-container">
                <img src={post.bannerUrl} alt={post.title} className="post-image" />
              </div>
              <div className="post-content">
                <h2>{post.title}</h2>
                <div className="post-meta">
                  <div className="author-info">
                    {post.author?.avatarUrl && (
                      <img src={post.author.avatarUrl} alt={post.author.username} className="author-pic" />
                    )}
                    <span>{post.author.firstname} {post.author.lastname}</span>
                  </div>
                  <div className="post-timestamp">
                    <span>Published: {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>Reading Time: {post.readTime} min</span>
                  </div>
                </div>
                <p>{post.content.slice(0, 100)}...</p>
                <div className="post-actions">
                  <Link to={`/posts/${post.id}`} className="read-more-button">Read More</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && !error && <p className='no-post'>No posts found for your search.</p> // Show message only if not loading and no error
        )}
      </div>
    </div>
  );
};

export default Blog;