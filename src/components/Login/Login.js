import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation to Forgot Password
import './Login.css'; // Assuming you have your CSS for styling
import apiEngine from '../../api/requests'; // Import your API engine
import endpoints from '../../api/endPoints'; // Import your API endpoints

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();  // Hook to navigate programmatically

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (email === '' || password === '') {
      setError('Please enter both email and password');
      return;
    }

    try {
      // Make an API call to login
      const response = await apiEngine.post(endpoints.AUTH_ENDPOINTS.LOGIN, {
        email, // Use email here
        password,
      });

      // Assuming your API returns user data on successful login
      const user = response.data;

      // Call the onLogin prop function with user data
      onLogin(user);  

      // Redirect to homepage after login
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        setError(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>

      {/* Forgot Password section */}
      <div className="forgot-password-section">
        <p>Forgot your password? 
          <Link to="/forgot-password" className="forgot-password-link"> Click here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
