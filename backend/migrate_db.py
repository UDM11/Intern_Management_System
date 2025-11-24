#!/usr/bin/env python3
"""
Database Migration Script
Recreates all tables with the current schema
"""

from sqlalchemy import create_engine, text
from config.database import Base, engine
from app.models.user import User
from app.models.intern import Intern
from app.models.task import Task

def migrate_database():
    """Drop and recreate all tables with current schema"""
    print("Starting database migration...")
    
    try:
        # Drop all tables
        print("Dropping existing tables...")
        Base.metadata.drop_all(bind=engine)
        
        # Create all tables with current schema
        print("Creating tables with new schema...")
        Base.metadata.create_all(bind=engine)
        
        print("Database migration completed successfully!")
        print("All tables have been recreated with the latest schema.")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    migrate_database()