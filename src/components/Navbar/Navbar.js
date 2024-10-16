import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        {/* <h1>Mindscribe</h1> */}
        <a href="/">Mindscribe</a>

      </div>

      <div className="nav-links">
        {/* Navigation Links Centered */}
        <div className="nav-center">
          <Link to="/" className="home-link">Home</Link>
          <Link to="/posts">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/contact" className="contact-link">Contact</Link>
        </div>

        {/* Conditional rendering for user */}
        <div className="nav-right">
          {user ? (
            <div className="user-info">
              <img src={user.photo} alt={user.username} className="user-photo" />
              <span>{user.username}</span>
              <button onClick={onLogout} className="logout-button">Logout</button>
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
