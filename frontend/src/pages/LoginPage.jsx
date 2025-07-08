import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        navigate('/admin');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="login-section">
      <div className="login-container">
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Enter your credentials to access the admin panel</p>
        
        <form onSubmit={handleSubmit}>
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email"
            required
          />
          
          <label className="form-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
            required
          />
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <div className="login-footer">
          <span>Don't have an account? <a href="/signup" className="signup-link">Sign up</a></span>
          <span><a href="/forgot-password" className="forgot-password">Forgot password?</a></span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 