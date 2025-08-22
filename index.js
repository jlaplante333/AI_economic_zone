require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const {
  corsOptions,
  errorHandler,
  requestLogger,
  securityHeaders,
  apiRateLimit
} = require('./backend/middleware/authMiddleware');

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.startsWith('sk-') : false);

const app = express();

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// CORS configuration
app.use(cors(corsOptions));

// Request logging
app.use(requestLogger);

// Rate limiting for all routes
app.use(apiRateLimit);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  version: 'REAL-BACKEND-VERSION-1.0',
  message: 'This is the real backend with database connection!'
}));

// API routes
const chatRoutes = require('./backend/routes/chatRoutes');
const authRoutes = require('./backend/routes/authRoutes');
const analyticsRoutes = require('./backend/routes/analyticsRoutes');
const ttsRoutes = require('./backend/routes/ttsRoutes');

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tts', ttsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_SERVICE || 'Not configured'}`);
  console.log(`📱 SMS service: ${process.env.TWILIO_ACCOUNT_SID ? 'Twilio configured' : 'Not configured'}`);
  console.log(`🔐 JWT secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
  console.log(`🗄️  Database: ${process.env.DB_HOST ? 'Configured' : 'Not configured'}`);
});
