#!/usr/bin/env python3
"""
Create Admin User Script
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.database import SessionLocal
from app.models.user import User
from app.utils.auth import get_password_hash

def create_admin_user():
    """Create default admin user"""
    try:
        db = SessionLocal()
        
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("Admin user already exists!")
            db.close()
            return
        
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            full_name="System Administrator",
            is_active=True,
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.close()
        
        print("Admin user created successfully!")
        print("Username: admin")
        print("Password: admin123")
        
    except Exception as e:
        print(f"Warning: Could not create admin user: {e}")
        print("This is normal during build - admin will be created on first run")
        # Don't fail the build process
        pass

if __name__ == "__main__":
    create_admin_user()