import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfessionalLanguagePage from './pages/ProfessionalLanguagePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
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
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
              {/* Public routes - accessible without login */}
              <Route path="/" element={<ProfessionalLanguagePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
              
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
          </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 