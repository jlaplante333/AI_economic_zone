import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import LanguageSelectionPage from './pages/LanguageSelectionPage';
import ProfessionalLanguagePage from './pages/ProfessionalLanguagePage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import FullChatPage from './pages/FullChatPage';
import AdminPage from './pages/AdminPage';
import AITestPage from './pages/AITestPage';
import './css/global/index.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LanguageSelectionPage />} />
              <Route path="/2" element={<ProfessionalLanguagePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/full-chat" element={<FullChatPage />} />
              <Route path="/fullchat" element={<FullChatPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/ai-test" element={<AITestPage />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 