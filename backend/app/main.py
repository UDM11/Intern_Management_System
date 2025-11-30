from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import engine, Base
from app.routes import auth, interns, tasks, dashboard, users, analytics, notifications
from app.models import User, Intern, Task, Notification

# Create tables
Base.metadata.create_all(bind=engine)

# Create admin user on startup
try:
    from create_admin import create_admin_user
    create_admin_user()
except Exception as e:
    print(f"Admin creation skipped: {e}")

app = FastAPI(
    title="Intern Management System API",
    description="Backend API for managing interns and their tasks",
    version="1.0.0"
)

# CORS - Allow specific origins for production
allowed_origins = [
    "https://intern-management-system-330cb.web.app",
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Routers
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
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)