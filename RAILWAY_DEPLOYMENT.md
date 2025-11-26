# Railway Deployment Guide

## Quick Setup (5 minutes)

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```
This opens browser - sign up with GitHub (free, no card required)

### 3. Deploy from Root Directory
```bash
cd "Intern Management System"
railway init
railway up
```

### 4. Add Environment Variables
```bash
railway variables set SECRET_KEY=your-secret-key-here
railway variables set ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Add PostgreSQL (Optional)
```bash
railway add postgresql
```
This automatically sets DATABASE_URL

## Alternative: Web Dashboard

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Railway auto-detects Python and deploys

## Environment Variables (Set in Railway Dashboard)
- `SECRET_KEY`: Generate random string
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 30
- `DATABASE_URL`: Auto-set if you add PostgreSQL

## Your API URLs
- **Live API**: `https://your-project.up.railway.app`
- **Docs**: `https://your-project.up.railway.app/docs`

## Create Admin User
After deployment, use Railway's shell:
```bash
railway shell
python backend/create_admin_render.py
```

## Update Frontend
Update your Firebase app's API URL:
```env
VITE_API_URL=https://your-project.up.railway.app/api
```

## Railway Free Tier
- $5 credit monthly (enough for small apps)
- No payment info required initially
- Sleeps after inactivity (like Render free tier)