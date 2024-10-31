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
import "./App.css";
import MyPosts from "./components/Blog/MyPosts";
import EditPost from "./components/Post/EditPostComponent";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const center = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    let userId;
    if (token) userId = jwtDecode(token).id;

    if (token) {
      axios
        .get(`https://mindscribe.praiseafk.tech/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
      setLoading(false);
    }
  }, []);

  const handleLogin = (data) => {
    const { accessToken, user } = data;
    localStorage.setItem("access_token", accessToken);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  if (loading) {
    return (
      <div style={center}>
        <BarLoader color={"#000"} loading={loading} size={50} />
      </div>
    );
  }

  return (
    <Router>
      <div className="wrapper">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/posts/my_posts" element={<MyPosts user={user} />} />
            <Route path="/posts/:id/edit" element={<EditPost user={user} />} />
            <Route path="/" element={<Home user={user} />} />
            <Route path="/posts" element={<Blog user={user} />} />
            <Route path="/posts/:id" element={<PostDetail user={user} />} />
            <Route path="/create-post" element={<CreatePost user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
