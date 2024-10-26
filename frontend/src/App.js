import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Blog from './components/Blog/Blog';
import CreatePost from './components/Post/CreatePost';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import SignUp from './components/Signup/Signup';
import Login from './components/Login/Login';
import PostDetail from './components/Post/PostDetail';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

function App() {
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch user profile if token exists on initial load
  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Retrieve the token

    if (token) {
      axios
        .get('https://mindscribe.praiseafk.tech/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { user } = response.data; // Extract user data
          setUser(user); // Set user data in state
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          handleLogout(); // Clear state if token is invalid
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  // Handle login by storing token and user data
  const handleLogin = (data) => {
    const { access_token, user } = data; // Extract token and user from response
    localStorage.setItem('access_token', access_token); // Store the token
    setUser(user); // Store user details in state
  };

  // Handle logout by removing token and clearing user state
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Remove the token
    setUser(null); // Clear user data from state
  };

  if (loading) return <div>Loading...</div>; // Display loading indicator

  return (
    <Router>
      <div className="App">
        {/* Pass user data (avatar, username) to Navbar */}
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Blog user={user} />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create-post" element={<CreatePost user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
