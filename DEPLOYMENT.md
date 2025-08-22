# 🚀 Oakland AI Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Full Stack)
Railway can host your entire app including database.

### Option 2: Vercel + Railway
- Vercel for frontend
- Railway for backend + database

### Option 3: Render
Free tier available for full-stack apps

## 🚀 Railway Deployment (Step by Step)

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Project
```bash
railway init
```

### 4. Add PostgreSQL Database
```bash
railway add
# Select "PostgreSQL" from the list
```

### 5. Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_very_long_random_secret_here
railway variables set OPENAI_API_KEY=your_openai_api_key
railway variables set RESEND_API_KEY=your_resend_api_key
railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 6. Deploy
```bash
railway up
```

### 7. Get Your URL
```bash
railway domain
```

## 🔧 Environment Variables Needed

Copy these to your Railway environment variables:

```bash
NODE_ENV=production
JWT_SECRET=generate_a_very_long_random_string_here
OPENAI_API_KEY=sk-your-openai-key-here
RESEND_API_KEY=re-your-resend-key-here
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

## 📊 Database Setup

After deployment, you'll need to run your database migrations:

```bash
# Connect to your Railway PostgreSQL
railway connect

# Run your schema
psql -d $DATABASE_URL -f database/schema.sql
```

## 🌐 Custom Domain (Optional)

1. Go to Railway dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update CORS origins in your environment variables

## 🔍 Troubleshooting

### Common Issues:
- **Database Connection**: Make sure DATABASE_URL is set correctly
- **CORS Errors**: Update CORS_ORIGINS with your domain
- **Build Failures**: Check that all dependencies are in package.json

### Check Logs:
```bash
railway logs
```

## 📱 Testing Your Deployed App

1. Visit your Railway URL
2. Test language selection
3. Test user registration
4. Test login functionality
5. Test chat features

## 💰 Cost Estimation

- **Railway**: $5/month after free tier
- **Vercel**: Free tier available
- **Render**: Free tier available
- **Custom Domain**: $10-15/year

## 🎯 Next Steps After Deployment

1. Set up monitoring (Railway provides basic monitoring)
2. Configure backups for your database
3. Set up error tracking (Sentry, LogRocket)
4. Configure analytics
5. Set up CI/CD for automatic deployments

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Check logs: `railway logs`
- Check status: `railway status`
