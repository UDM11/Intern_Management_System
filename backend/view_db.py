from sqlalchemy.orm import Session
from config.database import SessionLocal
from app.models.user import User
from app.models.intern import Intern
from app.models.task import Task
from tabulate import tabulate

def view_all_tables():
    """Display all data from database tables"""
    db = SessionLocal()
    
    try:
        print("=" * 80)
        print("DATABASE OVERVIEW")
        print("=" * 80)
        
        # Users Table
        users = db.query(User).all()
        print(f"\nUSERS TABLE ({len(users)} records)")
        print("-" * 50)
        if users:
            user_data = []
            for user in users:
                user_data.append([
                    user.id,
                    user.username,
                    user.email,
                    "Yes" if user.is_active else "No"
                ])
            print(tabulate(user_data, headers=["ID", "Username", "Email", "Active"], tablefmt="grid"))
        else:
            print("No users found")
        
        # Interns Table
        interns = db.query(Intern).all()
        print(f"\nINTERNS TABLE ({len(interns)} records)")
        print("-" * 50)
        if interns:
            intern_data = []
            for intern in interns:
                intern_data.append([
                    intern.id,
                    intern.full_name,
                    intern.email,
                    intern.department,
                    intern.status.value,
                    intern.join_date.strftime("%Y-%m-%d") if intern.join_date else "N/A"
                ])
            print(tabulate(intern_data, headers=["ID", "Name", "Email", "Department", "Status", "Join Date"], tablefmt="grid"))
        else:
            print("No interns found")
        
        # Tasks Table
        tasks = db.query(Task).all()
        print(f"\nTASKS TABLE ({len(tasks)} records)")
        print("-" * 50)
        if tasks:
            task_data = []
            for task in tasks:
                task_data.append([
                    task.id,
                    task.intern_id,
                    task.title[:30] + "..." if len(task.title) > 30 else task.title,
                    task.status.value,
                    task.deadline.strftime("%Y-%m-%d") if task.deadline else "N/A"
                ])
            print(tabulate(task_data, headers=["ID", "Intern ID", "Title", "Status", "Deadline"], tablefmt="grid"))
        else:
            print("No tasks found")
        
        # Summary Statistics
        print(f"\nSUMMARY STATISTICS")
        print("-" * 50)
        stats = [
            ["Total Users", len(users)],
            ["Total Interns", len(interns)],
            ["Active Interns", len([i for i in interns if i.status.value == "active"])],
            ["Total Tasks", len(tasks)],
            ["Completed Tasks", len([t for t in tasks if t.status.value == "completed"])],
            ["Pending Tasks", len([t for t in tasks if t.status.value == "pending"])]
        ]
        print(tabulate(stats, headers=["Metric", "Count"], tablefmt="grid"))
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    view_all_tables()