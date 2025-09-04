import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth';
import { auth } from '../lib/firebaseClient';

const FirebaseAuthContext = createContext();

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up with email and password
  const signUp = async (email, password, userData) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/auth/verify`
      });

      // Create user profile in your database
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/firebase-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
          ...userData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Link Firebase UID to existing profile if needed
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/link-firebase-uid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
        }),
      });

      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    try {
      if (user) {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/auth/verify`
        });
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Send password reset email
  const sendPasswordReset = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/auth/reset`
      });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Verify email with action code
  const verifyEmail = async (actionCode) => {
    try {
      setError(null);
      await applyActionCode(auth, actionCode);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password with action code
  const resetPassword = async (actionCode, newPassword) => {
    try {
      setError(null);
      await verifyPasswordResetCode(auth, actionCode);
      await confirmPasswordReset(auth, actionCode, newPassword);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get ID token for server requests
  const getIdToken = async () => {
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from your database
        try {
          const token = await user.getIdToken();
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const profileData = await response.json();
            setUser({
              ...user,
              ...profileData.user
            });
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    logout,
    sendVerificationEmail,
    sendPasswordReset,
    verifyEmail,
    resetPassword,
    getIdToken
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
