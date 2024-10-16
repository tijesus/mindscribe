import React, { useEffect } from 'react';
import './Home.css';
import posts from '../../data/Posts.json'; // Import the JSON data
import apiEngine from '../../api/requests';
import endpoints from '../../api/endPoints';


const Home = () => {

  useEffect(() => {
    async function loadPosts() {
      try {
        const posts = await apiEngine.get(`${endpoints.getPosts}?country=Nigeria`) 
        console.log(posts)
      } catch (error) {
        console.error(error)
      }
  }
  loadPosts()
  });



  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Mindscribe</h1>
          <p>Where creativity meets coding and stories unfold. Explore amazing articles, tutorials, and guides!</p>
          <a href="/posts" className="cta-button">Explore Posts</a>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="featured-posts">
      <h2>Featured Posts</h2>
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <img src={post.image} alt={post.title} className="post-image" />
              <h3>{post.title}</h3>
              <p>{post.content.slice(0, 100)}...</p> {/* Shortened content */}
              <a href={`/posts/${post.id}`} className="read-more">Read More</a>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <h2>Join the Community</h2>
        <p>Sign up today to receive the latest updates, tutorials, and tips directly in your inbox!</p>
        <a href="/signup" className="cta-button">Sign Up</a>
      </section>
    </div>
  );
};

export default Home;
