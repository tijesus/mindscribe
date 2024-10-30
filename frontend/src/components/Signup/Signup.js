import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Signup.css';
import apiEngine from '../../api/requests'; // API handler
import endpoints from '../../api/endPoints'; // API endpoints

const SignUp = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '', 
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstname, lastname, username, email, password, confirmPassword } = formData;

    if (!firstname.trim()) newErrors.firstname = 'First name is required';
    if (!lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!username.trim()) newErrors.username = 'Username is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must contain at least 8 characters, including uppercase, lowercase, number, and a special character';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true); // Set loading state to true
      setApiError(''); // Clear previous API error
      setSuccessMessage(''); // Clear previous success message

      try {
        // Use the SIGNUP endpoint from endpoints.js
        const response = await apiEngine.post(endpoints.AUTH_ENDPOINTS.SIGNUP, {
          firstname: formData.firstname,
          lastname: formData.lastname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        console.log('API Response:', response);
        setSuccessMessage('Account created successfully!'); // Set success message
        setFormData({ // Reset form data after successful signup
          firstname: '',
          lastname: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Redirect to the login page
        navigate('/login'); // Adjust the path according to your routing setup
      } catch (error) {
        console.error('Signup failed:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          setApiError(error.response.data.message || 'An error occurred during signup');
        } else if (error.request) {
          console.error('Request data:', error.request);
          setApiError('No response from the server. Please try again later.');
        } else {
          console.error('Error message:', error.message);
          setApiError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false); // Set loading state back to false
      }
    } else {
      setErrors(validationErrors);
      console.log("Validation Errors: ", validationErrors);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <p className="form-instruction">Please fill in all the fields below to create your account.</p>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* First Name Field */}
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname" 
            value={formData.firstname}
            onChange={handleChange}
            className={errors.firstname ? 'input-error' : ''}
            placeholder="Enter your first name"
            required
          />
          {errors.firstname && <span className="error-text">{errors.firstname}</span>}
        </div>

        {/* Last Name Field */}
        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            name="lastname" 
            value={formData.lastname}
            onChange={handleChange}
            className={errors.lastname ? 'input-error' : ''}
            placeholder="Enter your last name"
            required
          />
          {errors.lastname && <span className="error-text">{errors.lastname}</span>}
        </div>

        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'input-error' : ''}
            placeholder="Choose a username"
            required
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
            placeholder="Enter your email"
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
            placeholder="Enter a password (min. 8 characters)"
            required
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'input-error' : ''}
            placeholder="Confirm your password"
            required
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        {apiError && <p className="api-error">{apiError}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message display */}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'} {/* Show loading state */}
        </button>
      </form>
    </div>
  );
};

export default SignUp;