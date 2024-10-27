// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import apiEngine from '../../api/requests'; 
import endpoints from '../../api/endPoints'; 

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (email === '' || password === '') {
      setError('Please enter both email and password');
      return;
    }
  
    try {
      // Call the login API
      const response = await apiEngine.post(endpoints.AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });
  
      console.log('Full API Response:', response); // Log the entire response
  
      // Handle the response
      const { data } = response || {}; // Safely access the data object
  
      if (!data || !data.accessToken || !data.user) {
        throw new Error('Unexpected API response structure');
      }
  
      // If the structure is valid, continue
      const { accessToken, user } = data;
  
      onLogin({ accessToken, user });
      localStorage.setItem('access_token', accessToken);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
  
      if (error.response) {
        setError(error.response.data?.message || 'Invalid credentials. Please try again.');
      } else if (error.message) {
        setError(error.message);
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

      <div className="forgot-password-section">
        <p>Forgot your password? 
          <Link to="/forgot-password" className="forgot-password-link"> Click here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
