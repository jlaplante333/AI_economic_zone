import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulated login - accept any username and password
    if (username.trim() && password.trim()) {
      // Store user info in localStorage or state management
      localStorage.setItem('user', JSON.stringify({ name: username }));
      navigate('/chat');
    }
  };

  return (
    <div className="main-container">
      {/* Left side - Welcome section */}
      <div className="welcome-section">
        <div className="logo-section">
          <div className="logo-text" style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>Oakland AI</div>
        </div>
        
        <h1 className="main-heading">
          Smart help for<br />
          small businesses<br />
          in Oakland.
        </h1>
        
        <p className="sub-heading">
          Speak your language.<br />
          Get answers. No paperwork.
        </p>
        
        <p>
          Already have an account? <a href="/login" className="login-link">Log in</a>
        </p>
      </div>

      {/* Right side - Login section */}
      <div className="login-section">
        <div className="login-container">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your Oakland AI assistant</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <a href="#" className="signup-link">Sign up</a></p>
            <p><a href="#" className="forgot-password">Forgot password?</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage; 