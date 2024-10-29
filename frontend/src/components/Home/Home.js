import React, { useEffect, useState } from 'react';
import axios from 'axios';
import endpoints from '../../api/endPoints'; // Importing from endpoint.js
import './Home.css';
import { BarLoader } from "react-spinners";

const Home = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const page = 1; // Default page
    const limit = 10; // Default limit per page

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                // Properly invoke the GET_ALL function with parameters
                const url = endpoints.POSTS_ENDPOINTS.GET_ALL(page, limit);
                const response = await axios.get(url);

                console.log('API Response:', response); // Debugging

                if (response.status === 200 && Array.isArray(response.data.data)) {
                    setPosts(response.data.data); // Store posts in state
                    console.log('Posts successfully fetched:', response.data.data);
                } else {
                    console.error('Unexpected response structure:', response);
                    setPosts([]);
                }
            } catch (err) {
                console.error('Error fetching posts:', err);

                if (err.response) {
                    console.error('Server responded with:', err.response.status, err.response.data);
                    setError(`Error: ${err.response.status} - ${err.response.data.message || 'Unknown Error'}`);
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
        };
        loadPosts();
    }, [page, limit]); // Add dependencies to re-fetch on changes


    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <BarLoader color={'#000'} loading={loading} size={50} />
            </div>
        )
    }
    return (
        <div className="landing-page">
            <section className="hero">
                <div className="hero-content" style={{ display:'contents' }}>
                    <h1>Welcome to Mindscribe</h1>
                    <p>Explore amazing articles, tutorials, and guides!</p>
                    <a href="/posts" className="cta-button">Explore Posts</a>
                </div>
            </section>

            <section className="featured-posts">
                <h2>Featured Posts</h2>
                <div className="posts-grid">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <BarLoader color={'#000'} loading={loading} size={50} />
                        </div>
                    ) : error ? (
                        <p>{error}</p>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="post-card">
                                <img src={post.bannerUrl} alt={post.title} className="post-image" />
                                <h3>{post.title}</h3>
                                <p>{post.content.slice(0, 100)}...</p>
                                <a href={`/posts/${post.id}`} className="read-more">Read More</a>
                            </div>
                        ))
                    ) : (
                        <p>No posts available at this time.</p>
                    )}
                </div>
            </section>

            {!user ? <section className="cta">
                <h2>Join the Community</h2>
                <p>Sign up today to receive the latest updates, tutorials, and tips directly in your inbox!</p>
                <a href="/signup" className="cta-button">Sign Up</a>
            </section> : ''}
        </div>
    );
};

export default Home;
