# Oakland AI Chatbot

A full-stack AI chatbot application built with React frontend and Node.js backend, designed to provide intelligent responses and FAQ assistance for Oakland, California businesses. The application features multi-language support, business-specific guidance, and a modern, responsive interface.

## 🌟 Features

- **Multi-language Support**: Chat in multiple languages with automatic translation
- **Business-Specific Guidance**: Tailored responses for different business types in Oakland
- **Voice Input**: Speech-to-text functionality for hands-free interaction
- **FAQ System**: Dynamic suggestions and intelligent question handling
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Real-time Chat**: Instant AI responses with typing indicators
- **User Authentication**: Secure login/registration system
- **Analytics Dashboard**: Usage tracking and insights for admins
- **Business Images**: Visual representation for different business types

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (optional - app works without database)
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alicanacar007/Oakland_AI.git
   cd oaklandAI
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database (optional)**
   ```bash
   # Run the database schema
   psql -U your_username -d your_database -f database/schema.sql
   ```

### Running the Application

#### Option 1: Run Both Services (Recommended)
```bash
# Terminal 1 - Start Backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

#### Option 2: Run with PM2 (Production)
```bash
# Start both services with PM2
npm run pm2:start

# View logs
npm run pm2:logs

# Monitor processes
npm run pm2:monit
```

#### Option 3: Run Services Individually
```bash
# Backend only
npm run dev

# Frontend only
cd frontend && npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📁 Project Structure

```
oaklandAI/
├── backend/                 # Express.js API server
│   ├── config/             # Configuration files
│   │   ├── db.js           # Database configuration
│   │   ├── envLoader.js    # Environment variable loader
│   │   └── openaiConfig.js # OpenAI configuration
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── analyticsController.js
│   ├── middleware/         # Express middleware
│   │   └── authMiddleware.js
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── ChatLog.js
│   │   └── FAQInteraction.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── analyticsRoutes.js
│   ├── services/          # Business logic services
│   │   ├── openaiService.js
│   │   ├── faqService.js
│   │   ├── speechService.js
│   │   └── translationService.js
│   └── index.js           # Server entry point
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── FAQSuggestions.jsx
│   │   │   ├── VoiceInput.jsx
│   │   │   └── IconDemo.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── ChatPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── AITestPage.jsx
│   │   │   ├── FullChatPage.jsx
│   │   │   └── LanguageSelectionPage.jsx
│   │   ├── context/       # React context providers
│   │   │   ├── LanguageContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── themes/        # UI themes
│   │   │   ├── darkTheme.js
│   │   │   ├── whiteTheme.js
│   │   │   ├── beigeTheme.js
│   │   │   └── index.js
│   │   ├── language/      # Language files and translations
│   │   ├── assets/        # Static assets
│   │   │   └── businessPhoto/ # Business type images (40+ images)
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # App entry point
│   │   ├── index.css      # Global styles
│   │   └── login.css      # Login page styles
│   ├── dist/              # Production build
│   │   ├── assets/
│   │   └── index.html
│   ├── index.html         # HTML template
│   ├── ICON_GUIDE.md      # Icon usage guide
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── database/              # Database schema and migrations
│   └── schema.sql
├── ecosystem.config.js    # PM2 configuration
├── download-business-images.js # Business image downloader
├── logs/                  # PM2 log files
│   ├── backend-combined-0.log
│   ├── backend-error-0.log
│   ├── backend-out-0.log
│   ├── frontend-combined-1.log
│   ├── frontend-error-1.log
│   └── frontend-out-1.log
├── PM2_GUIDE.md          # PM2 deployment guide
├── RUN.md                # Run instructions
└── README.md
```

## 🔧 Configuration

### Environment Variables (.env)

**Important**: The `.env` file must be placed in the **root directory** of the project. Both frontend and backend are configured to load environment variables from the root directory.

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (optional)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo

# Optional: Speech Service
SPEECH_API_KEY=your_speech_api_key

# Optional: Translation Service
TRANSLATION_API_KEY=your_translation_api_key
```

### Environment Setup

The project is configured to automatically load environment variables from the root `.env` file. Here's how it works:

1. **Backend**: Uses `dotenv` to load `.env` from the root directory
2. **Frontend**: Vite is configured to load environment variables from the root directory
3. **PM2**: Both services are configured to load the `.env` file from the root directory

**Quick Setup**:
```bash
# Create .env file in root directory
cp .env.example .env

# Edit with your configuration
nano .env

# Test environment loading
npm run setup

# Start with proper environment loading
npm run start:all
```

**Troubleshooting**:
- If you get environment variable errors, ensure `.env` is in the root directory
- Use `npm run setup` to verify environment loading
- Check that all required variables are set in your `.env` file

### Database Setup (Optional)
The application works without a database, but for full functionality:
1. Install PostgreSQL
2. Create a database
3. Run the schema file: `database/schema.sql`

## 🛠️ Development

### Available Scripts

**Root Directory:**
- `npm start` - Start backend server
- `npm test` - Run all tests
- `npm run dev` - Start backend in development mode
- `npm run pm2:start` - Start both services with PM2
- `npm run pm2:stop` - Stop PM2 services
- `npm run pm2:restart` - Restart PM2 services
- `npm run pm2:logs` - View PM2 logs
- `npm run pm2:status` - Check PM2 status
- `npm run pm2:monit` - Monitor PM2 processes

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Chat
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history

#### Analytics
- `GET /api/analytics/usage` - Get usage analytics (admin)

#### Health
- `GET /health` - Health check
- `GET /api/ai/status` - AI service status

## 🎨 UI Features

### Multi-language Support
- Language selection page
- Automatic translation
- Support for multiple languages
- Context-aware responses

### Business-Specific Features
- 40+ business type images
- Tailored responses for different business types
- Oakland-specific business guidance
- Certification and licensing information

### Modern UI Components
- Responsive design
- Dark/light/beige themes
- Voice input with visual feedback
- FAQ suggestions
- Real-time chat interface

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test
```

## 📦 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
# Install production dependencies
npm install --production

# Start with PM2
npm run pm2:start

# Or deploy to your server (Heroku, AWS, etc.)
```

### PM2 Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js

# Monitor the application
pm2 monit

# View logs
pm2 logs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔗 Links

- **Repository**: https://github.com/alicanacar007/Oakland_AI
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

---

**Note**: Make sure both frontend and backend are running for the full application to work properly. The application can run without a database for basic functionality. 