// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Blog from "./components/Blog/Blog";
import CreatePost from "./components/Post/CreatePost";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import SignUp from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import PostDetail from "./components/Post/PostDetail";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import { jwtDecode } from "jwt-decode";
import { BarLoader } from "react-spinners";

function App() {
  const [user, setUser] = useState(null); // Store user details
  const [loading, setLoading] = useState(true); // Track loading state

  const center = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Retrieve the token
    let userId;
    if (token) userId = jwtDecode(token).id;

    if (token) {
      axios
        .get(`https://mindscribe.praiseafk.tech/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Fixed interpolation
        })
        .then((response) => {
          const user = response.data;
          setUser(user);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          handleLogout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  const handleLogin = (data) => {
    const { accessToken, user } = data; // Extract accessToken and user
    localStorage.setItem("access_token", accessToken); // Store the token
    setUser(user); // Store user data in state
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Clear token
    setUser(null); // Clear user state
  };

  if (loading)
    return (
      <div style={center}>
        <BarLoader color={"#000"} loading={loading} size={50} />
      </div>
    );

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} /> {/* Pass user data */}
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/posts" element={<Blog user={user} />} />
          <Route path="/posts/:id" element={<PostDetail user={user} />} />
          <Route path="/create-post" element={<CreatePost user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />{" "}
          {/* Handle login */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
