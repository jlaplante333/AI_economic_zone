# 🚀 PM2 Management Guide - Oakland AI

This guide explains how to use PM2 to manage your Oakland AI frontend and backend processes.

## 📋 Quick Commands

### Start All Services
```bash
npm run pm2:start
# or
pm2 start ecosystem.config.js
```

### Stop All Services
```bash
npm run pm2:stop
# or
pm2 stop ecosystem.config.js
```

### Restart All Services
```bash
npm run pm2:restart
# or
pm2 restart ecosystem.config.js
```

### View Status
```bash
npm run pm2:status
# or
pm2 status
```

### View Logs
```bash
npm run pm2:logs
# or
pm2 logs
```

### Monitor Processes
```bash
npm run pm2:monit
# or
pm2 monit
```

## 🔧 Individual Process Management

### Start Specific Process
```bash
# Start only backend
pm2 start ecosystem.config.js --only oakland-ai-backend

# Start only frontend
pm2 start ecosystem.config.js --only oakland-ai-frontend
```

### Restart Specific Process
```bash
# Restart backend
pm2 restart oakland-ai-backend

# Restart frontend
pm2 restart oakland-ai-frontend
```

### Stop Specific Process
```bash
# Stop backend
pm2 stop oakland-ai-backend

# Stop frontend
pm2 stop oakland-ai-frontend
```

## 📊 Process Information

### View Detailed Info
```bash
pm2 show oakland-ai-backend
pm2 show oakland-ai-frontend
```

### View Process List
```bash
pm2 list
```

### View Resource Usage
```bash
pm2 monit
```

## 📝 Log Management

### View All Logs
```bash
pm2 logs
```

### View Specific Process Logs
```bash
pm2 logs oakland-ai-backend
pm2 logs oakland-ai-frontend
```

### Clear Logs
```bash
pm2 flush
```

### View Log Files
```bash
# Backend logs
tail -f logs/backend-combined.log
tail -f logs/backend-error.log
tail -f logs/backend-out.log

# Frontend logs
tail -f logs/frontend-combined.log
tail -f logs/frontend-error.log
tail -f logs/frontend-out.log
```

## 🔄 Environment Management

### Development Mode
```bash
pm2 start ecosystem.config.js --env development
```

### Production Mode
```bash
pm2 start ecosystem.config.js --env production
```

### Switch Environment
```bash
pm2 reload ecosystem.config.js --env production
```

## 🛠️ Troubleshooting

### Reset PM2
```bash
pm2 kill
pm2 start ecosystem.config.js
```

### Delete All Processes
```bash
npm run pm2:delete
# or
pm2 delete all
```

### Save PM2 Configuration
```bash
pm2 save
```

### Restore PM2 Configuration
```bash
pm2 resurrect
```

## 📈 Performance Monitoring

### Monitor CPU/Memory
```bash
pm2 monit
```

### View Process Metrics
```bash
pm2 show oakland-ai-backend
pm2 show oakland-ai-frontend
```

### Set Resource Limits
```bash
# Restart if memory exceeds 1GB
pm2 restart oakland-ai-backend --max-memory-restart 1G
```

## 🔐 Security

### Update PM2
```bash
npm install -g pm2@latest
```

### Check PM2 Version
```bash
pm2 --version
```

## 🚨 Emergency Commands

### Kill All Processes
```bash
pm2 kill
```

### Force Stop
```bash
pm2 stop all --force
```

### Emergency Restart
```bash
pm2 restart all --force
```

## 📱 Application URLs

When running with PM2:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## ✅ Health Checks

### Check if Services are Running
```bash
# Check backend health
curl http://localhost:3001/health

# Check frontend
curl http://localhost:3000
```

### Check Process Status
```bash
pm2 status
```

## 🎯 Best Practices

1. **Always use PM2 scripts** from package.json for consistency
2. **Monitor logs regularly** to catch issues early
3. **Set up log rotation** for production environments
4. **Use environment-specific configurations**
5. **Save PM2 configuration** after setup: `pm2 save`
6. **Set up PM2 startup script**: `pm2 startup`

## 🔄 Auto-Start on Boot

### Save Current Configuration
```bash
pm2 save
```

### Generate Startup Script
```bash
pm2 startup
```

### Follow the instructions provided by the startup command

---

**💡 Tip**: Use `npm run dev:all` to start both services and immediately view logs! 