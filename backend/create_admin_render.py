#!/usr/bin/env python3
"""
Script to create admin user for Render deployment
Run this after deployment using Render's shell
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.utils.auth import get_password_hash
from app.models.user import User
from config.database import SessionLocal, engine, Base

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def create_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.username == 'admin').first()
        if existing_admin:
            print('Admin user already exists')
            return
        
        # Create admin user
        admin_user = User(
            username='admin',
            email='admin@example.com',
            hashed_password=get_password_hash('admin123')
        )
        db.add(admin_user)
        db.commit()
        print('Admin user created successfully!')
        print('Username: admin')
        print('Password: admin123')
        print('Please change the password after first login')
        
    except Exception as e:
        print(f'Error creating admin user: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()