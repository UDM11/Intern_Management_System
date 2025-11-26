# Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available)
- Your code pushed to GitHub repository

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Service

#### Option A: Using render.yaml (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to create services

#### Option B: Manual Setup
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: intern-management-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

### 3. Add Environment Variables
In Render dashboard, go to your service → Environment:
- `SECRET_KEY`: Generate a secure random string
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 30
- `DATABASE_URL`: (Auto-generated if using PostgreSQL service)

### 4. Create PostgreSQL Database (Optional)
1. Click "New" → "PostgreSQL"
2. Name: intern-management-db
3. Plan: Free
4. Copy the connection string to `DATABASE_URL` environment variable

### 5. Deploy
- Render will automatically deploy when you push to GitHub
- Check logs for any deployment issues
- Your API will be available at: `https://your-service-name.onrender.com`

## Post-Deployment

### Create Admin User
Use Render's shell or create a script:
```python
# create_admin_render.py
from app.utils.auth import get_password_hash
from app.models.user import User
from config.database import SessionLocal

db = SessionLocal()
user = User(
    username='admin',
    email='admin@example.com',
    hashed_password=get_password_hash('admin123')
)
db.add(user)
db.commit()
print('Admin user created: admin/admin123')
```

### Update Frontend Configuration
Update your Firebase frontend to use the new API URL:
```env
VITE_API_URL=https://your-service-name.onrender.com/api
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check requirements.txt and Python version
2. **Database connection**: Verify DATABASE_URL format
3. **CORS errors**: Update allowed origins in main.py
4. **File uploads**: Render's ephemeral filesystem - consider cloud storage

### Logs:
- Check Render dashboard logs for detailed error messages
- Use `print()` statements for debugging

### Performance:
- Free tier sleeps after 15 minutes of inactivity
- Consider upgrading for production use

## API Endpoints
Once deployed, your API will be available at:
- Base URL: `https://your-service-name.onrender.com`
- Docs: `https://your-service-name.onrender.com/docs`
- Health: `https://your-service-name.onrender.com/health`