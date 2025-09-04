import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfessionalLanguagePage from './pages/ProfessionalLanguagePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PasswordResetPage from './pages/PasswordResetPage';
import ChatPage from './pages/ChatPage';
import FullChatPage from './pages/FullChatPage';
import AdminPage from './pages/AdminPage';
import AITestPage from './pages/AITestPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import './css/global/index.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FirebaseAuthProvider>
          <Router>
            <div className="App">
              <Routes>
              {/* Public routes - accessible without login */}
              <Route path="/" element={<ProfessionalLanguagePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/verify" element={<EmailVerificationPage />} />
              <Route path="/auth/reset" element={<PasswordResetPage />} />
              
              {/* Protected routes - require authentication */}
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/full-chat" element={
                <ProtectedRoute>
                  <FullChatPage />
                </ProtectedRoute>
              } />
              <Route path="/fullchat" element={
                <ProtectedRoute>
                  <FullChatPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="/ai-test" element={
                <ProtectedRoute>
                  <AITestPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
          </FirebaseAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 