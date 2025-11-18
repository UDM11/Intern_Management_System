# Intern Management System

A full-stack web application for managing interns and their tasks with authentication, analytics, and real-time notifications.

## 🚀 Features

- **User Authentication** - JWT-based login/registration
- **Intern Management** - Add, edit, view, and manage intern profiles
- **Task Assignment** - Create and track tasks for interns
- **Dashboard Analytics** - Real-time statistics and insights
- **Notification System** - Real-time notifications for important events
- **Search & Filter** - Advanced search and filtering capabilities
- **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Project Structure

```
Intern Management System/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # Utility functions
│   ├── config/             # Configuration files
│   ├── main.py             # FastAPI application
│   └── requirements.txt    # Backend dependencies
└── README.md               # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL/SQLite** - Database
- **JWT** - Authentication
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- PostgreSQL (optional, SQLite works for development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd "Intern Management System"
```

### 2. Quick Start (Both Servers)
```bash
# Windows
start-dev.bat
```

### 3. Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```
Backend runs on: http://localhost:8000

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

### 4. Create Admin User
Before using the application, create an admin user:
```bash
cd backend
python -c "from app.utils.auth import get_password_hash; from app.models.user import User; from config.database import SessionLocal; db = SessionLocal(); user = User(username='admin', email='admin@example.com', hashed_password=get_password_hash('admin123')); db.add(user); db.commit(); print('Admin user created: admin/admin123')"
```

**Default Login Credentials:**
- Username: admin
- Password: admin123

## 📋 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/interns/` - List interns with pagination
- `POST /api/interns/` - Create new intern
- `GET /api/tasks/intern/{id}` - Get intern tasks
- `GET /api/dashboard/stats` - Dashboard statistics

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/intern_db
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend
Environment variables in `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

## 📱 Features Overview

### Dashboard
- Total interns and active status
- Task completion statistics
- Department-wise analytics
- Recent activity feed

### Intern Management
- Complete CRUD operations
- Search by name, email, department
- Filter by status and department
- Bulk operations support

### Task Management
- Assign tasks to interns
- Set deadlines and priorities
- Track completion status
- Overdue task notifications

### Authentication
- Secure JWT-based authentication
- Role-based access control
- Session management
- Password encryption

## 🚀 Deployment

### Backend Deployment
```bash
# Using Docker
docker build -t intern-backend .
docker run -p 8000:8000 intern-backend

# Using Heroku
heroku create intern-management-api
git push heroku main
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
# Upload dist/ folder
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the troubleshooting section below

## 🐛 Troubleshooting

### Common Issues

**Frontend blank page:**
- Check if backend is running on port 8000
- Verify API_URL in environment variables
- Check browser console for errors

**Database connection errors:**
- Verify DATABASE_URL in .env
- Ensure PostgreSQL is running
- Check database credentials

**Authentication issues:**
- Verify SECRET_KEY is set
- Check token expiration settings
- Clear browser localStorage

### Development Tips
- Use `npm run dev` for frontend hot reload
- Use `python run.py` for backend auto-reload
- Check network tab for API call issues
- Use browser dev tools for debugging