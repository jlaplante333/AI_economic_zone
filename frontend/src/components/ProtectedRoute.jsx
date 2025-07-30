import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is logged in by looking for token and user data in localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // If no token or user data, redirect to login with current location as redirect parameter
  if (!token || !user) {
    const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={loginUrl} replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute; 