# 🚀 Quick Run Guide - Oakland AI

This guide will get your Oakland AI chatbot up and running in minutes!

## ✅ Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js (v16 or higher) installed
- [ ] PostgreSQL database running
- [ ] Git repository cloned

## 🏃‍♂️ Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies  
cd backend && npm install && cd ..
```

### Step 2: Set Up Database

```bash
# Create database (if not exists)
createdb oakland_ai

# Run schema
psql -d oakland_ai -f database/schema.sql
```

### Step 3: Configure Environment

```bash
# Create backend environment file
cd backend
cp .env.example .env
# Edit .env with your settings
cd ..
```

**Required .env settings:**
```env
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/oakland_ai
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_api_key
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Should show: "Backend server running on port 3001"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Should show: "Local: http://localhost:3000/"
```

### Step 5: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

#### 2. Database Connection Error
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if needed
brew services start postgresql
```

#### 3. Module Not Found Errors
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la backend/.env

# Verify .env format (no spaces around =)
cat backend/.env
```

### Health Checks

#### Backend Health
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok"}
```

#### Frontend Health
```bash
curl http://localhost:3000
# Expected: HTML content
```

#### Database Health
```bash
psql -d oakland_ai -c "SELECT version();"
# Expected: PostgreSQL version info
```

## 🎯 Quick Commands Reference

### Development
```bash
# Start both services
npm run dev:all

# Start backend only
cd backend && npm start

# Start frontend only
cd frontend && npm run dev

# Run tests
npm test
```

### Database
```bash
# Reset database
psql -d oakland_ai -f database/schema.sql

# View tables
psql -d oakland_ai -c "\dt"

# Check connections
psql -d oakland_ai -c "SELECT * FROM pg_stat_activity;"
```

### Logs
```bash
# Backend logs
cd backend && npm start

# Frontend logs
cd frontend && npm run dev

# System logs
tail -f /var/log/system.log | grep -i node
```

## 📱 Testing the Application

### 1. Basic Functionality
- [ ] Open http://localhost:3000
- [ ] Check if page loads without errors
- [ ] Verify chat interface is visible

### 2. Authentication
- [ ] Try to register a new user
- [ ] Try to login with credentials
- [ ] Check if JWT token is received

### 3. Chat Functionality
- [ ] Send a test message
- [ ] Check if AI responds
- [ ] Verify message history

### 4. Voice Input (if enabled)
- [ ] Click microphone button
- [ ] Allow microphone access
- [ ] Test voice-to-text

## 🚨 Emergency Stop

If you need to stop everything quickly:

```bash
# Stop all Node.js processes
pkill -f "node"

# Stop PostgreSQL
brew services stop postgresql

# Clear ports
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:3001 | xargs kill -9
```

## 🔄 Restart Everything

```bash
# Stop all services
pkill -f "node"

# Start fresh
cd backend && npm start &
cd ../frontend && npm run dev &
```

## 📞 Need Help?

1. **Check the logs** - Look for error messages
2. **Verify prerequisites** - Node.js, PostgreSQL, etc.
3. **Check ports** - Make sure 3000 and 3001 are free
4. **Review .env** - Ensure all variables are set correctly
5. **Restart services** - Sometimes a fresh start helps

## 🎉 Success!

If you see:
- ✅ Backend running on port 3001
- ✅ Frontend running on port 3000  
- ✅ Database connected
- ✅ Health check responding

**Congratulations! Your Oakland AI chatbot is ready to use!** 🎊

---

**Next Steps:**
- Explore the application at http://localhost:3000
- Check out the detailed README files for more information
- Start developing new features! 