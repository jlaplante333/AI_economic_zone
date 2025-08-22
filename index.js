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
app.use(cors({
  origin: ['https://ai-economic-zone-static.onrender.com', 'http://localhost:3003'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
    console.log('=== REGISTER ENDPOINT CALLED ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    
    const { email, password, firstName, lastName, businessType, language, ethnicity, gender } = req.body;
    
    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: email, password, firstName, lastName' 
      });
    }
    
    // Check if email already exists (in a real app, this would check the database)
    // For now, just simulate success
    
    console.log('Registration attempt:', { email, firstName, lastName, businessType, language, ethnicity, gender });
    
    const responseData = {
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: { 
        id: Math.floor(Math.random() * 1000) + 1, 
        email: email, 
        firstName: firstName,
        lastName: lastName,
        is_verified: false 
      }
    };
    
    console.log('Sending response:', responseData);
    console.log('Response length:', JSON.stringify(responseData).length);
    
    res.json(responseData);
    console.log('=== REGISTER ENDPOINT COMPLETED ===');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
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

// Test endpoints
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

app.get('/api/auth/register', (req, res) => {
  res.json({ success: true, message: 'Register endpoint is working!' });
});

app.get('/api/auth/login', (req, res) => {
  res.json({ success: true, message: 'Login endpoint is working!' });
});

app.get('/api/chat', (req, res) => {
  res.json({ success: true, message: 'Chat endpoint is working!' });
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
