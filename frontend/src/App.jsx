import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import ProfessionalLanguagePage from './pages/ProfessionalLanguagePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<ProfessionalLanguagePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/full-chat" element={<FullChatPage />} />
              <Route path="/fullchat" element={<FullChatPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/ai-test" element={<AITestPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 