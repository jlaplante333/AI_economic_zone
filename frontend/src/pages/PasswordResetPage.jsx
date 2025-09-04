import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import { Lock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import '../css/pages/password-reset.css';

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useFirebaseAuth();
  const [status, setStatus] = useState('form'); // 'form', 'success', 'error'
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const actionCode = searchParams.get('oobCode');
    if (!actionCode) {
      setStatus('error');
      setMessage('Invalid password reset link. Please request a new one.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const actionCode = searchParams.get('oobCode');
      await resetPassword(actionCode, password);
      setStatus('success');
      setMessage('Password reset successfully! You can now sign in with your new password.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      setStatus('error');
      
      if (error.code === 'auth/invalid-action-code') {
        setMessage('This password reset link is invalid or has expired. Please request a new one.');
      } else if (error.code === 'auth/weak-password') {
        setMessage('Password is too weak. Please choose a stronger password.');
      } else {
        setMessage('Password reset failed. Please try again or request a new link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'form':
        return (
          <div className="reset-content">
            <div className="reset-icon">
              <Lock size={48} className="lock-icon" />
            </div>
            <h2>Reset Your Password</h2>
            <p>Enter your new password below.</p>
            
            <form onSubmit={handleSubmit} className="reset-form">
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Enter your new password"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Confirm your new password"
                  className="form-input"
                />
              </div>
              
              {message && <div className="error-message">{message}</div>}
              
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        );

      case 'success':
        return (
          <div className="reset-content">
            <div className="reset-icon success">
              <CheckCircle size={48} className="success-icon" />
            </div>
            <h2>Password Reset Successful!</h2>
            <p>{message}</p>
            <p>Redirecting to login...</p>
          </div>
        );

      case 'error':
        return (
          <div className="reset-content">
            <div className="reset-icon error">
              <XCircle size={48} className="error-icon" />
            </div>
            <h2>Password Reset Failed</h2>
            <p>{message}</p>
            <div className="reset-actions">
              <button
                onClick={() => navigate('/forgot-password')}
                className="forgot-button"
              >
                Request New Reset Link
              </button>
              <button
                onClick={() => navigate('/login')}
                className="login-button"
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <div className="reset-header">
          <button 
            onClick={() => navigate('/login')} 
            className="back-button"
            aria-label="Go back to login"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Password Reset</h1>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default PasswordResetPage;
