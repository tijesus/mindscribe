import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passwords
    if (password === '' || confirmPassword === '') {
      setMessage('Please fill in both fields.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    // Simulate successful password reset (replace with backend logic)
    setMessage('');
    setShowPopup(true); // Show the success popup

    // Reset the form
    setPassword('');
    setConfirmPassword('');

    // Redirect to login page after 3 seconds
    setTimeout(() => {
      setShowPopup(false); // Hide popup
      navigate('/login'); // Redirect to login page
    }, 3000); // 3 seconds
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {message && <p className="error-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="password">New Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="reset-password-button">Reset Password</button>
      </form>

      {/* Popup Success Message */}
      {showPopup && (
        <div className="success-popup">
          <p>Password has been successfully reset! Redirecting to login...</p>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
