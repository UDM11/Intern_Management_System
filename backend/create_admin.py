#!/usr/bin/env python3
"""
Script to create an admin user for the Intern Management System
"""

from app.utils.auth import get_password_hash
from app.models.user import User
from config.database import SessionLocal

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin user already exists
        existing_user = db.query(User).filter(User.username == 'admin').first()
        if existing_user:
            print("Admin user already exists!")
            return
        
        # Create admin user
        hashed_password = get_password_hash('admin123')
        admin_user = User(
            username='admin',
            email='admin@example.com',
            hashed_password=hashed_password
        )
        
        db.add(admin_user)
        db.commit()
        
        print("✅ Admin user created successfully!")
        print("Username: admin")
        print("Password: admin123")
        print("Email: admin@example.com")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()