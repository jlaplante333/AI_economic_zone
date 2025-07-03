# Oakland AI Backend

Express.js API server for the Oakland AI Chatbot application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   # Run the database schema
   psql -U your_username -d your_database -f ../database/schema.sql
   ```

### Running the Server

```bash
# Development mode
npm start

# Or directly with node
node index.js

# With nodemon (if installed)
nodemon index.js
```

The server will start on port 3001 (or the port specified in your .env file).

## 🔧 Configuration

### Environment Variables (.env)

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo

# Optional: Speech Service
SPEECH_API_KEY=your_speech_api_key

# Optional: Translation Service
TRANSLATION_API_KEY=your_translation_api_key
```

### Database Setup

1. **Install PostgreSQL**
2. **Create database**
   ```sql
   CREATE DATABASE oakland_ai;
   ```
3. **Run schema**
   ```bash
   psql -U your_username -d oakland_ai -f ../database/schema.sql
   ```

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── db.js              # Database configuration
│   ├── envLoader.js       # Environment variable loader
│   └── openaiConfig.js    # OpenAI configuration
├── controllers/           # Route controllers
│   ├── authController.js  # Authentication logic
│   ├── chatController.js  # Chat functionality
│   └── analyticsController.js # Analytics
├── middleware/            # Express middleware
│   └── authMiddleware.js  # JWT authentication
├── models/               # Database models
│   ├── User.js           # User model
│   ├── ChatLog.js        # Chat log model
│   └── FAQInteraction.js # FAQ interaction model
├── routes/               # API routes
│   ├── authRoutes.js     # Authentication routes
│   ├── chatRoutes.js     # Chat routes
│   └── analyticsRoutes.js # Analytics routes
├── services/             # Business logic
│   ├── openaiService.js  # OpenAI integration
│   ├── faqService.js     # FAQ handling
│   ├── speechService.js  # Speech processing
│   └── translationService.js # Translation
├── index.js              # Server entry point
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "name": "John Doe"
  }
}
```

### Chat Routes (`/api/chat`)

#### POST `/api/chat/message`
Send a message to the AI chatbot.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "message": "Hello, how can you help me?",
  "context": "optional_context"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Hello! I'm here to help you with any questions about Oakland...",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### GET `/api/chat/history`
Get chat history for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "message": "Hello",
      "response": "Hi there!",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Analytics Routes (`/api/analytics`)

#### GET `/api/analytics/usage`
Get usage analytics (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 150,
    "totalMessages": 1250,
    "activeUsers": 45,
    "popularQuestions": [...]
  }
}
```

### Health Check

#### GET `/health`
Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🛠️ Development

### Available Scripts

```bash
# Start the server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- authController.test.js

# Run tests with coverage
npm run test:coverage
```

### Database Operations

```bash
# Run migrations (if using a migration tool)
npm run migrate

# Seed database with test data
npm run seed

# Reset database
npm run db:reset
```

## 🔒 Security

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expiration handling

### CORS
- Configured for frontend domain
- Adjustable in production

### Rate Limiting
- Implement rate limiting for API endpoints
- Configurable limits per endpoint

## 📊 Monitoring

### Health Checks
- `/health` endpoint for basic health monitoring
- Database connection status
- External service status (OpenAI, etc.)

### Logging
- Request/response logging
- Error logging with stack traces
- Performance monitoring

## 🚀 Deployment

### Production Setup

1. **Set environment variables**
   ```bash
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=your_production_db_url
   JWT_SECRET=your_production_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

2. **Install production dependencies**
   ```bash
   npm install --production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment-Specific Configurations

- **Development**: Detailed logging, CORS enabled for localhost
- **Production**: Minimal logging, CORS restricted to frontend domain
- **Testing**: In-memory database, mock external services

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Verify database exists

2. **JWT Token Issues**
   - Check JWT_SECRET is set
   - Verify token expiration time

3. **OpenAI API Errors**
   - Verify OPENAI_API_KEY is valid
   - Check API quota and limits

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm start

# Enable specific debug categories
DEBUG=app:*,db:* npm start
```

## 📝 API Documentation

For detailed API documentation, see the individual route files or use tools like:
- Swagger/OpenAPI
- Postman collection
- API documentation generators

---

**Note**: Always keep your environment variables secure and never commit them to version control. 