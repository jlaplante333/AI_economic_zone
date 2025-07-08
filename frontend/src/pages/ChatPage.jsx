import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState({ frontend: null, backend: null, loading: false });
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

  const checkStatus = async () => {
    setStatus({ frontend: null, backend: null, loading: true });
    // Check frontend (this page)
    let frontendOk = false;
    try {
      const res = await fetch('/');
      frontendOk = res.ok;
    } catch {
      frontendOk = false;
    }
    // Check backend
    let backendOk = false;
    try {
      const res = await fetch('http://localhost:3001/health');
      backendOk = res.ok;
    } catch {
      backendOk = false;
    }
    setStatus({ frontend: frontendOk, backend: backendOk, loading: false });
    setShowStatus(true);
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
        <button
          style={{
            marginBottom: 16,
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: '#64748b',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 16
          }}
          onClick={checkStatus}
        >
          Development Status
        </button>
        <h1 className="main-heading">
          Smart help for<br />
          small businesses<br />
          in Oakland.
        </h1>
        <p className="sub-heading">
          Speak your language.<br />
          Get answers. No paperwork.
        </p>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Already have an account? <a href="/login" className="login-link" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Log in</a>
          </p>
        {/* Status Modal */}
        {showStatus && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
            onClick={() => setShowStatus(false)}
          >
            <div style={{
              background: 'white',
              color: '#22223b',
              borderRadius: 16,
              padding: 32,
              minWidth: 320,
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              position: 'relative',
              textAlign: 'center'
            }} onClick={e => e.stopPropagation()}>
              <h2 style={{marginBottom: 16}}>Development Status</h2>
              {status.loading ? (
                <div>Checking...</div>
              ) : (
                <>
                  <div style={{marginBottom: 12}}>
                    <span style={{fontWeight: 600}}>Frontend: </span>
                    <span style={{
                      color: status.frontend ? '#22c55e' : '#dc2626',
                      fontWeight: 700
                    }}>{status.frontend ? 'Running' : 'Down'}</span>
                  </div>
                  <div style={{marginBottom: 12}}>
                    <span style={{fontWeight: 600}}>Backend: </span>
                    <span style={{
                      color: status.backend ? '#22c55e' : '#dc2626',
                      fontWeight: 700
                    }}>{status.backend ? 'Running' : 'Down'}</span>
                  </div>
                  <button
                    style={{
                      marginTop: 16,
                      padding: '8px 20px',
                      borderRadius: 6,
                      border: 'none',
                      background: '#64748b',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 15
                    }}
                    onClick={() => setShowStatus(false)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}
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