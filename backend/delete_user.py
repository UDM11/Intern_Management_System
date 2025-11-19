from sqlalchemy.orm import Session
from config.database import SessionLocal
from app.models.user import User

def delete_user_by_id(user_id: int):
    """Delete user by ID"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            print(f"✅ User '{user.username}' (ID: {user_id}) deleted successfully")
            return True
        else:
            print(f"❌ User with ID {user_id} not found")
            return False
    except Exception as e:
        db.rollback()
        print(f"❌ Error deleting user: {e}")
        return False
    finally:
        db.close()

def delete_user_by_username(username: str):
    """Delete user by username"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if user:
            db.delete(user)
            db.commit()
            print(f"✅ User '{username}' deleted successfully")
            return True
        else:
            print(f"❌ User '{username}' not found")
            return False
    except Exception as e:
        db.rollback()
        print(f"❌ Error deleting user: {e}")
        return False
    finally:
        db.close()

def list_all_users():
    """List all users"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        if users:
            print("\n📋 All Users:")
            print("-" * 40)
            for user in users:
                print(f"ID: {user.id} | Username: {user.username} | Email: {user.email}")
        else:
            print("No users found")
    except Exception as e:
        print(f"❌ Error listing users: {e}")
    finally:
        db.close()

def main():
    print("🗑️  User Deletion Tool")
    print("=" * 30)
    
    while True:
        print("\nOptions:")
        print("1. List all users")
        print("2. Delete user by ID")
        print("3. Delete user by username")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            list_all_users()
        elif choice == "2":
            try:
                user_id = int(input("Enter user ID to delete: "))
                delete_user_by_id(user_id)
            except ValueError:
                print("❌ Please enter a valid number")
        elif choice == "3":
            username = input("Enter username to delete: ").strip()
            if username:
                delete_user_by_username(username)
            else:
                print("❌ Username cannot be empty")
        elif choice == "4":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main()