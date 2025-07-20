# Oakland AI Authentication System Setup Guide

## 🎯 Overview

This document provides a comprehensive guide to the new authentication system implemented for Oakland AI. The system includes user registration, email/SMS verification, secure login, admin functionality, and anonymous analytics.

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### 2. Database Setup
```bash
# Install PostgreSQL dependencies
npm install

# Run database setup
npm run db:setup

# Or manually:
sudo -u postgres psql -f database/setup.sql
```

### 3. Initialize Application
```bash
# Run setup script
npm run init

# Start backend
npm run dev

# Start frontend (in another terminal)
cd frontend && npm run dev
```

## 🔐 Authentication Features

### User Registration
- **Email verification** via Resend (free tier)
- **SMS verification** via Twilio (free trial)
- **Password strength** validation
- **Business type** selection
- **Language preference** storage

### Login System
- **JWT-based** authentication
- **Account lockout** after 5 failed attempts
- **Session management**
- **Remember me** functionality

### Password Management
- **Secure password reset** via email
- **Token-based** reset links
- **Password strength** requirements
- **Account recovery** options

### Admin Features
- **User management** dashboard
- **Analytics** and insights
- **Anonymous data** collection
- **Audit logging**

## 📊 Database Schema

### Core Tables
- `users` - User accounts and profiles
- `email_verifications` - Email verification tokens
- `sms_verifications` - SMS verification codes
- `chat_logs` - Chat history with anonymous support
- `user_sessions` - Active user sessions
- `analytics_events` - User behavior tracking
- `admin_audit_log` - Admin action logging

### Key Features
- **Anonymous tracking** for unauthenticated users
- **Business type** analytics
- **Language preference** tracking
- **Session management**
- **Data retention** policies

## 🔧 Configuration

### Environment Variables

#### Database
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oaklandai
DB_USER=oaklandai_user
DB_PASSWORD=your_secure_password
```

#### Authentication
```env
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

#### Email Service (Resend)
```env
EMAIL_SERVICE=resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@oaklandai.com
```

#### SMS Service (Twilio)
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

#### Admin Configuration
```env
ADMIN_EMAIL=admin@oaklandai.com
ADMIN_PASSWORD=admin123456
```

## 🛠️ API Endpoints

### Authentication Routes

#### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### Protected Endpoints
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

#### Admin Endpoints
- `GET /api/auth/users` - Get all users (admin only)
- `DELETE /api/auth/users/:userId` - Delete user (admin only)
- `POST /api/auth/admin` - Create admin user (admin only)

### Request/Response Examples

#### Registration
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "language": "en",
  "businessType": "restaurant"
}

Response:
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false
  }
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isAdmin": false,
    "language": "en",
    "businessType": "restaurant",
    "isVerified": true
  }
}
```

## 🔒 Security Features

### Password Security
- **bcrypt** hashing with configurable rounds
- **Minimum 8 characters** requirement
- **Account lockout** after failed attempts
- **Secure password reset** tokens

### Session Management
- **JWT tokens** with expiration
- **Secure token storage** in localStorage
- **Automatic logout** on token expiration
- **Session cleanup** on logout

### Rate Limiting
- **Login attempts**: 5 per 15 minutes
- **Registration**: 3 per hour
- **Password reset**: 3 per hour
- **General API**: 100 per 15 minutes

### Data Protection
- **Anonymous analytics** for privacy
- **No personal data** in analytics
- **Data retention** policies
- **Secure headers** implementation

## 📱 Frontend Integration

### Authentication Context
```jsx
import { useAuth } from '../context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

### Protected Routes
```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<ProtectedRoute>
  <FullChatPage />
</ProtectedRoute>

<ProtectedRoute requireAdmin>
  <AdminPage />
</ProtectedRoute>
```

### Login Component
```jsx
const { login, loading, error } = useAuth();

const handleLogin = async (email, password) => {
  const result = await login(email, password);
  if (result.success) {
    navigate('/fullchat');
  }
};
```

## 📊 Analytics & Privacy

### Anonymous Tracking
- **Session-based** analytics
- **No personal information** collected
- **Business type** insights
- **Language usage** patterns

### Admin Dashboard
- **Real-time** user statistics
- **Engagement metrics**
- **Business type** distribution
- **Recent activity** feed

### Data Retention
- **Chat logs**: 1 year
- **Analytics events**: 6 months
- **Verification tokens**: 24 hours
- **Password reset tokens**: 1 hour

## 🚀 Deployment

### Production Setup
```bash
# Set production environment
NODE_ENV=production

# Configure production database
DB_HOST=your_production_host
DB_PASSWORD=your_production_password

# Set secure JWT secret
JWT_SECRET=your_production_jwt_secret

# Configure HTTPS URLs
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Configure HTTPS
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging

## 🧪 Testing

### Manual Testing
```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Automated Testing
```bash
# Run all tests
npm test

# Run specific test files
npm test -- authController.test.js
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U oaklandai_user -d oaklandai -c "SELECT 1;"
```

#### Email Service
```bash
# Check Resend configuration
curl -X GET https://api.resend.com/domains \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### SMS Service
```bash
# Check Twilio configuration
curl -X GET https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages \
  -u "YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN"
```

### Logs
```bash
# Backend logs
npm run pm2:logs

# Database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## 📚 Additional Resources

- [README.md](./README.md) - Main project documentation
- [database/schema.sql](./database/schema.sql) - Database schema
- [backend/controllers/authController.js](./backend/controllers/authController.js) - Authentication logic
- [frontend/src/context/AuthContext.jsx](./frontend/src/context/AuthContext.jsx) - Frontend auth context

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs
3. Create an issue in the repository
4. Contact the development team

---

**Note**: This authentication system is designed to be secure, scalable, and privacy-focused. Always follow security best practices when deploying to production. 