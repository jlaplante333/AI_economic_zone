require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.startsWith('sk-') : false);

const app = express();

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  version: 'SIMPLIFIED-VERSION-2.0',
  message: 'This is the updated code that should work!'
}));

// Simple auth routes for testing
app.post('/api/auth/register', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: { id: 1, email: req.body.email, is_verified: false }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'test-token',
      user: { id: 1, email: req.body.email, is_verified: true }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🔐 JWT secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
});
