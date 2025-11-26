from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.database import engine, Base
from .routes import auth, interns, tasks, dashboard, users, analytics, notifications
# Import all models to ensure they are registered with SQLAlchemy
from .models import User, Intern, Task, Notification

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Intern Management System API",
    description="Backend API for managing interns and their tasks",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000", 
        "http://localhost:8080",
        "https://*.web.app",
        "https://*.firebaseapp.com",
        "*"  # Allow all origins for production - configure specific domains later
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(interns.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(notifications.router, prefix="/api/notifications")

@app.get("/")
def root():
    return {"message": "Intern Management System API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)