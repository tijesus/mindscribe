// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import apiEngine from "../../api/requests"; // Import your API engine
import endpoints from "../../api/endPoints"; // Import your API endpoints

const Navbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      // Call the API to log out the user
      // await apiEngine.post(endpoints.AUTH_ENDPOINTS.LOGOUT);

      fetch("https://mindscribe.praiseafk.tech/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => {
          if (response.status === 204) {
            console.log("logout successful");
            return;
          }
          return response.json();
        })
        .then((data) => (data ? console.log(data) : data))
        .catch((err) => console.log(err));

      // Clear the token from local storage and update parent state
      localStorage.removeItem("access_token"); // Ensure token is cleared
      onLogout(); // Call the parent onLogout function to clear user state
    } catch (error) {
      console.error("Logout failed:", error);
      // Optional: Display a message to the user if logout fails
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Mindscribe</Link> {/* Use Link for navigation */}
      </div>

      <div className="nav-links">
        <div className="nav-center">
          <Link to="/" className="home-link">
            Home
          </Link>
          <Link to="/posts">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/contact" className="contact-link">
            Contact
          </Link>
        </div>

        <div className="nav-right">
          {user ? (
            <div className="user-info">
              <img
                src={user.avatarUrl} // Use avatarUrl instead of photo
                alt={user.username}
                className="user-photo"
              />
              <span class='username-container'>{user.username}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
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
