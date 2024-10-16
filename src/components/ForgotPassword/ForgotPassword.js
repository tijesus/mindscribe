import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate sending a reset link (replace with your backend logic)
    if (email === '') {
      setMessage('Please enter your email address.');
      return;
    }

    // Simulate an email being sent
    setMessage(`A reset password link has been sent to ${email}. Please check your inbox.`);
    
    // Reset the form
    setEmail('');
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email Address:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="forgot-password-button">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
