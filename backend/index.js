require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const {
  corsOptions,
  errorHandler,
  requestLogger,
  securityHeaders,
  apiRateLimit
} = require('./middleware/authMiddleware');

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

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Rate limiting for all routes
app.use(apiRateLimit);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Health check endpoint
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
}));

// API routes
console.log('🔍 Loading API routes...');

const chatRoutes = require('./routes/chatRoutes');
console.log('✅ Chat routes loaded');

const authRoutes = require('./routes/authRoutes');
console.log('✅ Auth routes loaded');

const firebaseAuthRoutes = require('./routes/firebaseAuthRoutes');
console.log('✅ Firebase Auth routes loaded');

const analyticsRoutes = require('./routes/analyticsRoutes');
console.log('✅ Analytics routes loaded');

const ttsRoutes = require('./routes/ttsRoutes');
console.log('✅ TTS routes loaded');

console.log('🔍 Mounting routes...');
app.use('/api/chat', chatRoutes);
console.log('✅ Chat routes mounted at /api/chat');

app.use('/api/auth', authRoutes);
console.log('✅ Auth routes mounted at /api/auth');

app.use('/api/auth', firebaseAuthRoutes);
console.log('✅ Firebase Auth routes mounted at /api/auth');

app.use('/api/analytics', analyticsRoutes);
console.log('✅ Analytics routes mounted at /api/analytics');

app.use('/api/tts', ttsRoutes);
console.log('✅ TTS routes mounted at /api/tts');

console.log('🔍 All routes mounted successfully');

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