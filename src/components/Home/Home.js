import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.cs';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadPosts() {
            setLoading(true);
            try {
                const url = 'https://mindscribe.praiseafk.tech/posts/?page=1&limit=10'; // Directly using the full URL
                const response = await axios.get(url); // Using axios directly for the call

                console.log('API Response:', response); // Log the response for debugging

                if (response.data && Array.isArray(response.data.data)) {
                    setPosts(response.data.data);
                    console.log('Posts successfully fetched:', response.data.data);
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setPosts([]); 
                }
            } catch (err) {
                console.error('Error fetching posts:', err);

                if (err.response) {
                    console.error('Server responded with:', err.response.status, err.response.data);
                    setError(`Error: ${err.response.status} - ${err.response.data.message || 'Unknown Error'}`); // Corrected error setting
                } else if (err.request) {
                    console.error('No response received:', err.request);
                    setError('No response from server. Check your connection.');
                } else {
                    console.error('Error setting up request:', err.message);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    return (
        <div className="landing-page">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Mindscribe</h1>
                    <p>Explore amazing articles, tutorials, and guides!</p>
                    <a href="/posts" className="cta-button">Explore Posts</a>
                </div>
            </section>

            <section className="featured-posts">
                <h2>Featured Posts</h2>
                <div className="posts-grid">
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="post-card">
                                <img src={post.bannerUrl} alt={post.title} className="post-image" />
                                <h3>{post.title}</h3>
                                <p>{post.content.slice(0, 100)}...</p>
                                <a href={`/posts/${post.id}`} className="read-more">Read More</a> {/* Corrected link */}
                            </div>
                        ))
                    ) : (
                        <p>No posts available at this time.</p>
                    )}
                </div>
            </section>

            <section className="cta">
                <h2>Join the Community</h2>
                <p>Sign up today to receive the latest updates, tutorials, and tips directly in your inbox!</p>
                <a href="/signup" className="cta-button">Sign Up</a>
            </section>
        </div>
    );
};

export default Home;
