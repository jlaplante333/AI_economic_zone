import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, token, loading } = useAuth();
  
  // Show loading while AuthContext initializes
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If no token or user data, redirect to login with current location as redirect parameter
  if (!token || !user) {
    const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={loginUrl} replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute; 