import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Blog from './components/Blog/Blog'; // Import the Blog page
import CreatePost from './components/Post/CreatePost'; // Import CreatePost page
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import SignUp from './components/Signup/Signup';
import Login from './components/Login/Login';
import PostDetail from './components/Post/PostDetail'; // To view individual posts
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user); // Set the user after login
  };

  const handleLogout = () => {
    setUser(null); // Clear the user on logout
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Blog user={user} />} /> {/* Blog page */}
          <Route path="/posts/:id" element={<PostDetail />} /> {/* Individual post */}
          <Route path="/create-post" element={<CreatePost user={user} />} /> {/* Create Post */}
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
