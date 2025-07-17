import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ChatPage from './pages/ChatPage';
import FullChatPage from './pages/FullChatPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AITestPage from './pages/AITestPage';
import LanguageSelectionPage from './pages/LanguageSelectionPage';
import IconDemo from './components/IconDemo';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LanguageSelectionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/fullchat" element={<FullChatPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/test" element={<AITestPage />} />
              <Route path="/icons" element={<IconDemo />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 