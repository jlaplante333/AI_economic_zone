# Oakland AI - Smart Business Assistant

A comprehensive AI-powered chatbot designed to help small businesses in Oakland navigate local regulations, permits, and business requirements. Features multi-language support, email/SMS verification, anonymous analytics, and a modern theme-aware interface.

## 🚀 Features

### Core Functionality
- **Multi-language AI Chatbot** - Support for 50+ languages
- **Business-Specific Guidance** - Tailored responses for different business types
- **Voice Input/Output** - Speech-to-text and text-to-speech capabilities
- **Real-time Translation** - Instant language translation
- **Dynamic Theme System** - Dark, Light, and Beige themes with seamless switching
- **Modern UI/UX** - Glassmorphism effects, smooth animations, and responsive design

### Authentication & Security
- **User Registration & Login** - Secure JWT-based authentication
- **Complete Signup Flow** - Multi-step registration with business type selection
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
- **Chat Logging** - Complete conversation history with business context
- **Popular Questions Tracking** - Identify trending business topics

### User Experience & Accessibility
- **Theme-Aware Interface** - All pages adapt to user's theme preference
- **Enhanced Profile Page** - Modern user profile with comprehensive information display
- **Interactive Quick Options** - Dynamic business topic suggestions
- **Responsive Design** - Optimized for all device sizes
- **Accessibility Features** - High contrast ratios, keyboard navigation, screen reader support
- **Smooth Animations** - Professional hover effects and transitions
- **Glassmorphism Design** - Modern visual effects with backdrop blur

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
- **Recharts** - Data visualization
- **Theme Context** - Dynamic theme switching

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

## 🎨 Theme System

### Available Themes
- **Dark Theme** - Professional dark interface with blue accents
- **Light Theme** - Clean white interface with blue highlights  
- **Beige Theme** - Warm earth-toned interface with brown accents

### Theme Features
- **Automatic Persistence** - Theme preference saved across sessions
- **Seamless Switching** - Instant theme changes without page reload
- **Consistent Styling** - All components adapt to current theme
- **Accessibility Optimized** - High contrast ratios in all themes

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/your-username/Oakland_AI.git
cd Oakland_AI
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### 3. Database Setup
```bash
# Run database migrations
npm run db:setup

# Verify setup
npm run db:verify
```

### 4. Start Development
```bash
# Start backend (port 3000)
cd backend && npm start

# Start frontend (port 3001) - in new terminal
cd frontend && npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:3001/admin

## 📊 Analytics Dashboard

### Features
- **Real-time Metrics** - Live user engagement data
- **Business Type Analytics** - Industry-specific insights
- **Language Usage** - Multi-language support statistics
- **Popular Questions** - Trending business topics
- **User Engagement** - Session duration and interaction patterns
- **Theme Usage** - User preference analytics

### Access
- Navigate to Analytics page from user menu
- View comprehensive business insights
- Export data for further analysis

## 🔧 Development

### Project Structure
```
Oakland_AI/
├── backend/                 # Node.js/Express backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── middleware/        # Custom middleware
├── frontend/              # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── css/           # Stylesheets
│   │   └── components/    # Reusable components
│   └── public/            # Static assets
├── database/              # Database schemas and migrations
└── docs/                  # Documentation
```

### Key Components
- **ThemeContext** - Manages theme state and switching
- **AnalyticsPage** - Comprehensive analytics dashboard
- **ProfilePage** - Modern user profile interface
- **FullChatPage** - Enhanced chat interface with quick options
- **SignupPage** - Complete user registration flow

## 🚀 Deployment

### Production Setup
```bash
# Install PM2 globally
npm install -g pm2

# Build frontend
cd frontend && npm run build

# Start production servers
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit
```

### Environment Variables
```bash
# Required for production
NODE_ENV=production
DB_HOST=your_db_host
DB_NAME=oaklandai
DB_USER=oaklandai_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@oaklandai.com or create an issue in the GitHub repository.

---

**Oakland AI** - Empowering Oakland businesses with intelligent guidance and modern technology.
