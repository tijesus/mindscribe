import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/requests'; // Adjust the import path as necessary
import './Profile.css'; // Add your styles here

const Profile = () => {
  const [user, setUser] = useState(null); // Store user data
  const [posts, setPosts] = useState([]); // Store user's posts
  const [likedPosts, setLikedPosts] = useState([]); // Store liked posts
  const [comments, setComments] = useState([]); // Store user's comments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Use this to retrieve the logged-in user's info, you may not need this
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile. Please try again later.');
    }
  };

  // Fetch user's posts
  const fetchUserPosts = async () => {
    try {
      const response = await axiosInstance.get('/posts/my_post');
      setPosts(response.data.posts); // Adjust according to your API response
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Failed to load user posts. Please try again later.');
    }
  };

  // Fetch liked posts
  const fetchLikedPosts = async () => {
    try {
      const response = await axiosInstance.get('/posts/liked_posts'); // Adjust the endpoint
      setLikedPosts(response.data.likedPosts); // Adjust according to your API response
    } catch (err) {
      console.error('Error fetching liked posts:', err);
      setError('Failed to load liked posts. Please try again later.');
    }
  };

  // Fetch user's comments
  const fetchUserComments = async () => {
    try {
      const response = await axiosInstance.get('/posts/my_comments'); // Adjust the endpoint
      setComments(response.data.comments); // Adjust according to your API response
    } catch (err) {
      console.error('Error fetching user comments:', err);
      setError('Failed to load user comments. Please try again later.');
    }
  };

  // Fetch all user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
      await fetchUserPosts();
      await fetchLikedPosts();
      await fetchUserComments();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Show loading, error, or the profile details
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <h1>{user.username}'s Profile</h1>
      <div className="profile-info">
        <img src={user.avatarUrl} alt={user.username} className="avatar" />
        <h2>{user.firstname} {user.lastname}</h2>
        <p>Email: {user.email}</p>
        {/* Add other user information as needed */}
      </div>

      <section className="posts-section">
        <h2>Your Posts</h2>
        {posts.length > 0 ? (
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>Published on: {new Date(post.createdAt).toLocaleDateString()}</p>
                {/* Add links to edit or delete posts if necessary */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts found.</p>
        )}
      </section>

      <section className="liked-posts-section">
        <h2>Liked Posts</h2>
        {likedPosts.length > 0 ? (
          <ul>
            {likedPosts.map(post => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>Liked on: {new Date(post.likedAt).toLocaleDateString()}</p>
                {/* Add links to view the post if necessary */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No liked posts found.</p>
        )}
      </section>

      <section className="comments-section">
        <h2>Your Comments</h2>
        {comments.length > 0 ? (
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>
                <p>{comment.content}</p>
                <p>On post: {comment.postTitle}</p> {/* Assuming you have a title for the post */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments found.</p>
        )}
      </section>
    </div>
  );
};

export default Profile;
