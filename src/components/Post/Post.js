import React, { useState, useEffect } from 'react';
import './Post.css';
import postsData from '../../data/Posts.json'; // Assuming this is your JSON file or replace with API call

const Post = ({ user }) => {
  const [posts, setPosts] = useState([]); // To store all posts from the database and user posts
  const [title, setTitle] = useState(''); // For post title
  const [content, setContent] = useState(''); // For post content
  const [editingPost, setEditingPost] = useState(null); // To manage editing

  useEffect(() => {
    // Fetch posts from posts.json or your backend
    setPosts(postsData);
  }, []);

  // Create a new post
  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      id: Date.now(),
      title,
      content,
      username: user.username, // Post is associated with the current user
      timestamp: new Date().toLocaleString(),
    };

    setPosts([...posts, newPost]);
    setTitle('');
    setContent('');
  };

  // Edit post
  const handleEdit = (id) => {
    const postToEdit = posts.find((post) => post.id === id);
    setTitle(postToEdit.title);
    setContent(postToEdit.content);
    setEditingPost(id);
  };

  // Save edited post
  const handleSave = () => {
    setPosts(
      posts.map((post) =>
        post.id === editingPost ? { ...post, title, content } : post
      )
    );
    setTitle('');
    setContent('');
    setEditingPost(null);
  };

  // Delete a post
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="post-component">
      {/* Form to create or edit post */}
      {user && (
        <form onSubmit={editingPost ? handleSave : handleSubmit} className="create-post-form">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your post here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <button type="submit">{editingPost ? 'Save Changes' : 'Create Post'}</button>
        </form>
      )}

      {/* Display all posts */}
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="post" key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p className="post-info">Posted by {post.username} on {post.timestamp}</p>
              {/* Check if the post belongs to the current user */}
              {user && post.username === user.username && (
                <div className="post-actions">
                  <button onClick={() => handleEdit(post.id)}>Edit</button>
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Post;
