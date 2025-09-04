import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import { CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';
import '../css/pages/EmailVerificationPage.css';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, sendVerificationEmail, user } = useFirebaseAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const actionCode = searchParams.get('oobCode');
    
    if (actionCode) {
      handleVerification(actionCode);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
    }
  }, [searchParams]);

  const handleVerification = async (actionCode) => {
    try {
      await verifyEmail(actionCode);
      setStatus('success');
      setMessage('Email verified successfully! You can now access all features.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      
      if (error.code === 'auth/invalid-action-code') {
        setMessage('This verification link is invalid or has expired. Please request a new one.');
      } else if (error.code === 'auth/user-disabled') {
        setMessage('This account has been disabled. Please contact support.');
      } else {
        setMessage('Email verification failed. Please try again or contact support.');
      }
    }
  };

  const handleResendVerification = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsResending(true);
    try {
      await sendVerificationEmail();
      setMessage('Verification email sent successfully! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="verification-content">
            <div className="verification-icon">
              <Mail size={48} className="mail-icon" />
            </div>
            <h2>Verifying Your Email</h2>
            <p>Please wait while we verify your email address...</p>
          </div>
        );

      case 'success':
        return (
          <div className="verification-content">
            <div className="verification-icon success">
              <CheckCircle size={48} className="success-icon" />
            </div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <p>Redirecting to login...</p>
          </div>
        );

      case 'error':
        return (
          <div className="verification-content">
            <div className="verification-icon error">
              <XCircle size={48} className="error-icon" />
            </div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <div className="verification-actions">
              {user && (
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="resend-button"
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              )}
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
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <button 
            onClick={() => navigate('/login')} 
            className="back-button"
            aria-label="Go back to login"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Email Verification</h1>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
