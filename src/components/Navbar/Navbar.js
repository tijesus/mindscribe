import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import apiEngine from '../../api/requests'; // Import your API engine
import endpoints from '../../api/endPoints'; // Import your API endpoints

const Navbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      // Call the API to log out the user
      await apiEngine.post(endpoints.AUTH_ENDPOINTS.LOGOUT);
      
      // Clear user session from local storage or context
      localStorage.removeItem('user'); // Adjust as per your storage mechanism
      onLogout(); // Call the onLogout prop to update the parent state
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error, if necessary (e.g., show a message)
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">Mindscribe</a>
      </div>

      <div className="nav-links">
        <div className="nav-center">
          <Link to="/" className="home-link">Home</Link>
          <Link to="/posts">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/contact" className="contact-link">Contact</Link>
        </div>

        <div className="nav-right">
          {user ? (
            <div className="user-info">
              <img src={user.photo} alt={user.username} className="user-photo" />
              <span>{user.username}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
