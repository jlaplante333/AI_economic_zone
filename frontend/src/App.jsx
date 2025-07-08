import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import FullChatPage from './pages/FullChatPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AITestPage from './pages/AITestPage';
import IconDemo from './components/IconDemo';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/chat" element={<FullChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/test" element={<AITestPage />} />
          <Route path="/icons" element={<IconDemo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 