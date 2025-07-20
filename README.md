# Oakland AI - Smart Business Assistant

A comprehensive AI-powered chatbot designed to help small businesses in Oakland navigate local regulations, permits, and business requirements. Features multi-language support, email/SMS verification, and anonymous analytics for data insights.

## 🚀 Features

### Core Functionality
- **Multi-language AI Chatbot** - Support for 50+ languages
- **Business-Specific Guidance** - Tailored responses for different business types
- **Voice Input/Output** - Speech-to-text and text-to-speech capabilities
- **Real-time Translation** - Instant language translation

### Authentication & Security
- **User Registration & Login** - Secure JWT-based authentication
- **Email Verification** - Account verification via email (Resend)
- **SMS Verification** - Phone number verification (Twilio)
- **Password Reset** - Secure password recovery system
- **Admin Panel** - User management and analytics dashboard
- **Rate Limiting** - Protection against abuse
- **Security Headers** - Comprehensive security measures

### Analytics & Data
- **Anonymous Analytics** - Track usage without compromising privacy
- **User Engagement Metrics** - Detailed user behavior analysis
- **Business Type Insights** - Industry-specific usage patterns
- **Language Analytics** - Multi-language usage statistics
- **Admin Dashboard** - Real-time analytics and user management

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Resend** - Email service
- **Twilio** - SMS service
- **OpenAI** - AI chat capabilities

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Lucide React** - Icons
- **Context API** - State management

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- PM2 (for production)

## 🗄️ PostgreSQL Setup

### 1. Install PostgreSQL (macOS)
```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

### 2. Create Database and User
```bash
# Connect to PostgreSQL
psql postgres

# Create database (if it doesn't exist)
CREATE DATABASE oaklandai;

# Create user
CREATE USER oaklandai_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE oaklandai TO oaklandai_user;

# Exit PostgreSQL
\q
```

### 3. Run Database Setup
```bash
# Option 1: Use the setup script (recommended)
npm run db:setup

# Option 2: Manual setup
psql -d oaklandai -f database/schema.sql

# Option 3: Use the automated setup
sudo -u postgres psql -f database/setup.sql
```

### 4. Verify Database Setup
```bash
# Connect to the database
psql -U oaklandai_user -d oaklandai

# Check tables
\dt

# Check if admin user exists
SELECT email, is_admin FROM users WHERE is_admin = true;

# Exit
\q
```

## ⚙️ Environment Configuration

### 1. Create Environment File
```bash
# The .env file is already created with template values
# Update with your actual configuration:
nano .env
```

### 2. Required Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oaklandai
DB_USER=oaklandai_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Email Configuration (Resend - Free Tier)
EMAIL_SERVICE=resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@oaklandai.com

# SMS Configuration (Twilio - Free Trial)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Server Configuration
PORT=3000
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Admin Configuration
ADMIN_EMAIL=admin@oaklandai.com
ADMIN_PASSWORD=admin123456
```

### 3. Third-Party Service Setup

#### Resend (Email Service) - Free Tier
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add your domain or use the provided sandbox domain
4. Update `RESEND_API_KEY` in your `.env` file

#### Twilio (SMS Service) - Free Trial
1. Sign up at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token
3. Get a phone number for SMS
4. Update Twilio credentials in your `.env` file

#### OpenAI
1. Sign up at [openai.com](https://openai.com)
2. Get your API key
3. Update `OPENAI_API_KEY` in your `.env` file

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd oaklandAI
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Database Setup
```bash
# Run database setup (creates tables, indexes, and admin user)
npm run db:setup

# Or use the automated setup script
npm run init
```

### 4. Initialize Application
```bash
# Run the comprehensive setup script
npm run init

# This will:
# - Check environment configuration
# - Verify database connection
# - Create admin user
# - Run basic tests
```

### 5. Start Development Servers
```bash
# Start backend server (Terminal 1)
npm run dev

# Start frontend server (Terminal 2)
cd frontend
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### 7. Default Admin Access
- **Email**: `admin@oaklandai.com`
- **Password**: `admin123456`

## 🏗️ Project Structure

```
oaklandAI/
├── backend/
│   ├── config/
│   │   ├── db.js              # Database configuration
│   │   ├── envLoader.js       # Environment loader
│   │   └── openaiConfig.js    # OpenAI configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── chatController.js  # Chat functionality
│   │   └── analyticsController.js # Analytics
│   ├── middleware/
│   │   └── authMiddleware.js  # Authentication middleware
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── ChatLog.js        # Chat logging
│   │   └── FAQInteraction.js # FAQ tracking
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication routes
│   │   ├── chatRoutes.js     # Chat routes
│   │   └── analyticsRoutes.js # Analytics routes
│   ├── services/
│   │   ├── emailService.js   # Email functionality
│   │   ├── smsService.js     # SMS functionality
│   │   ├── openaiService.js  # OpenAI integration
│   │   └── translationService.js # Translation
│   └── index.js              # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── css/            # Stylesheets
│   │   └── main.jsx        # App entry point
│   └── package.json
├── database/
│   ├── schema.sql          # Database schema
│   └── setup.sql           # Database setup script
├── .env                    # Environment variables
├── setup.js               # Setup script
└── package.json
```

## 🔐 Authentication System

### User Registration Flow
1. User fills registration form
2. Account created with email verification token
3. Verification email sent via Resend
4. SMS verification code sent (if phone provided)
5. User verifies email/SMS
6. Welcome email sent
7. User can now login

### Login Flow
1. User enters credentials
2. Password verified with bcrypt
3. Account lockout after 5 failed attempts
4. JWT token generated on success
5. Last login updated

### Password Reset Flow
1. User requests password reset
2. Reset token generated and stored
3. Reset email sent with link
4. User clicks link and sets new password
5. Token invalidated after use

## 📊 Analytics & Data Privacy

### Anonymous Analytics
- Chat logs stored with anonymous IDs for unauthenticated users
- No personal information collected without consent
- Business type and language preferences tracked
- Session-based analytics for insights

### Admin Dashboard
- Real-time user statistics
- Business type distribution
- Language usage patterns
- User engagement metrics
- Recent activity feed

### Data Retention
- Chat logs retained for 1 year by default
- User accounts can be deleted by admins
- Anonymous data automatically cleaned up

## 🚀 Production Deployment

### Using PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start all services
npm run pm2:start

# Monitor processes
npm run pm2:monit

# View logs
npm run pm2:logs
```

### Environment Setup
```bash
# Set production environment
NODE_ENV=production

# Use production database
DB_HOST=your_production_db_host
DB_PASSWORD=your_production_db_password

# Configure production URLs
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
# Test database connection
psql -U oaklandai_user -d oaklandai -c "SELECT 1;"

# Test backend health
curl http://localhost:3000/health

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

### Automated Testing
```bash
# Run backend tests
npm test

# Run specific test files
npm test -- authController.test.js
```

## 📝 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "language": "en",
  "businessType": "restaurant"
}
```

#### POST /api/auth/login
Login to existing account
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### GET /api/auth/verify-email/:token
Verify email address

#### POST /api/auth/forgot-password
Request password reset
```json
{
  "email": "user@example.com"
}
```

#### POST /api/auth/reset-password
Reset password with token
```json
{
  "token": "reset_token_here",
  "password": "newpassword123"
}
```

### Chat Endpoints

#### POST /api/chat/message
Send a chat message
```json
{
  "message": "How do I get a business license?",
  "businessType": "restaurant",
  "language": "en"
}
```

### Analytics Endpoints (Admin Only)

#### GET /api/analytics/stats
Get analytics statistics

#### GET /api/analytics/users
Get user management data

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Test connection
psql -U oaklandai_user -d oaklandai -c "SELECT 1;"

# Restart PostgreSQL if needed
brew services restart postgresql@15
```

#### Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

#### Environment Variables
```bash
# Check if .env is loaded
npm run check-env

# Verify environment setup
npm run setup
```

### Logs
```bash
# Backend logs
npm run pm2:logs

# Database logs
tail -f /opt/homebrew/var/log/postgresql@15.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks
- Monitor database performance
- Clean up old chat logs
- Update dependencies
- Review security settings
- Backup database regularly

### Monitoring
- Server health checks
- Database connection monitoring
- API response times
- Error rate tracking
- User engagement metrics

---

<<<<<<< HEAD
**Note**: This project is now fully configured with a complete authentication system, PostgreSQL database, and production-ready setup. The FullChatPage requires login, and you have comprehensive admin functionality for user management and analytics. 
=======
**Note**: Make sure both frontend and backend are running for the full application to work properly. The application can run without a database for basic functionality. 
>>>>>>> b60b49daf0119b04f28b5d413c88481b97040cd3
