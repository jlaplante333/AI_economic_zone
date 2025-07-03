# Oakland AI Chatbot

A full-stack AI chatbot application built with React frontend and Node.js backend, designed to provide intelligent responses and FAQ assistance.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oaklandAI
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Run the database schema
   psql -U your_username -d your_database -f database/schema.sql
   ```

### Running the Application

#### Option 1: Run Both Services (Recommended)
```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

#### Option 2: Run Services Individually
```bash
# Backend only
cd backend && node index.js

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
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── index.js           # Server entry point
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── main.jsx       # App entry point
│   └── package.json
├── database/              # Database schema and migrations
└── README.md
```

## 🔧 Configuration

### Environment Variables (backend/.env)
```env
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup
The application uses PostgreSQL. Make sure to:
1. Install PostgreSQL
2. Create a database
3. Run the schema file: `database/schema.sql`

## 🛠️ Development

### Available Scripts

**Root Directory:**
- `npm test` - Run all tests

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm start` - Start the server
- `npm test` - Run backend tests

### API Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/chat/message` - Send chat message
- `GET /api/analytics/usage` - Get usage analytics

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
cd backend
npm install --production
# Deploy to your server (Heroku, AWS, etc.)
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

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Note**: Make sure both frontend and backend are running for the full application to work properly. 