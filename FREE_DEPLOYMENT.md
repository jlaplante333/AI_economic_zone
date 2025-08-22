# 🆓 FREE Deployment Guide - Oakland AI

## 🎯 **Best Free Option: Render**

Render offers a generous free tier that can host your entire app for $0/month!

### **What's Free:**
- ✅ **Backend**: Web service (sleeps after 15 min inactivity)
- ✅ **Frontend**: Static site hosting
- ✅ **Database**: PostgreSQL (free tier)
- ✅ **Custom domains**: Free
- ✅ **SSL certificates**: Free

### **Limitations:**
- ⚠️ Backend sleeps after 15 min of inactivity (first request wakes it up)
- ⚠️ Database has 1GB storage limit
- ⚠️ 750 hours/month of runtime

## 🚀 **Render Deployment (Step by Step)**

### **Step 1: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free)
3. Verify your email

### **Step 2: Deploy from GitHub**
1. Click "New +"
2. Select "Blueprint" (uses our render.yaml)
3. Connect your GitHub repo: `jlaplante333/AI_economic_zone`
4. Click "Connect"

### **Step 3: Configure Environment Variables**
After deployment, go to your backend service and add:
```
OPENAI_API_KEY=your_openai_key_here
RESEND_API_KEY=your_resend_key_here
```

### **Step 4: Get Your URLs**
- **Frontend**: `https://oakland-ai-frontend.onrender.com`
- **Backend**: `https://oakland-ai-backend.onrender.com`

## 🌐 **Alternative Free Options**

### **Option 2: Vercel + Supabase**
```bash
# Frontend on Vercel
npm install -g vercel
cd frontend
vercel

# Backend as Vercel serverless functions
# Database on Supabase (free tier)
```

### **Option 3: Netlify + Supabase**
```bash
# Frontend on Netlify
npm install -g netlify-cli
cd frontend
netlify deploy

# Backend as Netlify functions
# Database on Supabase (free tier)
```

### **Option 4: GitHub Pages + Railway Free Tier**
- Frontend: GitHub Pages (free)
- Backend: Railway (free tier available)
- Database: Railway PostgreSQL (free tier)

## 🔧 **Render-Specific Setup**

### **Database Migration**
After deployment, connect to your Render PostgreSQL:
```bash
# Get connection string from Render dashboard
psql "your_connection_string_here"

# Run your schema
\i database/schema.sql
```

### **Custom Domain (Free)**
1. Go to your frontend service in Render
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records

## 💰 **Cost Comparison**

| Platform | Monthly Cost | Database | Sleep Mode |
|----------|--------------|----------|------------|
| **Render** | $0 | ✅ Free | ⚠️ 15 min |
| **Railway** | $5 | ✅ Included | ❌ No |
| **Vercel** | $0 | ❌ Separate | ❌ No |
| **Netlify** | $0 | ❌ Separate | ❌ No |

## 🎯 **Why Render is Best for Free:**

1. **Full-stack hosting** - Backend + Frontend + Database
2. **Generous free tier** - No hidden costs
3. **Easy deployment** - One-click from GitHub
4. **Custom domains** - Free SSL included
5. **Good performance** - Fast CDN

## 🚨 **Important Notes:**

### **Sleep Mode Workaround:**
- First user request wakes up the backend (takes ~30 seconds)
- Subsequent requests are fast
- Consider using a service like UptimeRobot to ping your backend every 10 minutes

### **Database Limits:**
- 1GB storage (enough for thousands of users)
- 750 hours/month runtime
- Automatic backups

## 🔍 **Troubleshooting**

### **Common Issues:**
- **Build failures**: Check that all dependencies are in package.json
- **Database connection**: Verify DATABASE_URL is set correctly
- **CORS errors**: Update CORS_ORIGINS with your Render domain

### **Check Logs:**
- Go to your service in Render dashboard
- Click "Logs" tab
- Real-time error tracking

## 🎉 **After Free Deployment:**

1. **Test your app** at your Render URL
2. **Share the link** with users
3. **Monitor usage** in Render dashboard
4. **Scale up** only if needed (still very affordable)

## 🆘 **Need Help?**

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check logs in Render dashboard
- Monitor service status

## 🚀 **Ready to Deploy Free?**

1. **Sign up at render.com**
2. **Connect your GitHub repo**
3. **Deploy with our render.yaml**
4. **Set your API keys**
5. **Share your free app!**
