import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user information from local storage to persist state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user state if available
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user)); // Store user info in local storage
    setUser(user); // Set the user after login
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user info from local storage
    setUser(null); // Clear the user on logout
  };

  return (
    <Router>
      <div className="App">
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
