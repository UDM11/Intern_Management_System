from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
from config.database import get_db
from app.models.intern import Intern, InternStatus
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

class DashboardStats(BaseModel):
    total_users: int
    total_interns: int
    active_interns: int
    total_tasks: int
    pending_tasks: int
    completed_tasks: int
    overdue_tasks: int

class DepartmentStats(BaseModel):
    department: str
    intern_count: int

class RecentActivity(BaseModel):
    id: str
    message: str
    timestamp: str
    type: str

class TopPerformer(BaseModel):
    id: int
    name: str
    department: str
    completedTasks: int
    completionRate: float
    avgCompletionTime: float

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_users = db.query(User).count()
    total_interns = db.query(Intern).count()
    active_interns = db.query(Intern).filter(Intern.status == InternStatus.ACTIVE).count()
    total_tasks = db.query(Task).count()
    pending_tasks = db.query(Task).filter(Task.status == TaskStatus.PENDING).count()
    completed_tasks = db.query(Task).filter(Task.status == TaskStatus.COMPLETED).count()
    overdue_tasks = db.query(Task).filter(Task.status == TaskStatus.OVERDUE).count()
    
    return DashboardStats(
        total_users=total_users,
        total_interns=total_interns,
        active_interns=active_interns,
        total_tasks=total_tasks,
        pending_tasks=pending_tasks,
        completed_tasks=completed_tasks,
        overdue_tasks=overdue_tasks
    )

@router.get("/departments")
def get_department_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    department_stats = db.query(
        Intern.department,
        func.count(Intern.id).label('intern_count')
    ).group_by(Intern.department).all()
    
    return [
        {"department": dept, "intern_count": count}
        for dept, count in department_stats
    ]

@router.get("/recent-activities", response_model=List[RecentActivity])
def get_recent_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activities = []
    
    # Recent interns (last 7 days)
    recent_interns = db.query(Intern).filter(
        Intern.created_at >= datetime.utcnow() - timedelta(days=7)
    ).order_by(desc(Intern.created_at)).limit(5).all()
    
    for intern in recent_interns:
        activities.append(RecentActivity(
            id=f"intern_{intern.id}",
            message=f"New intern {intern.full_name} joined {intern.department}",
            timestamp=intern.created_at.strftime("%Y-%m-%d %H:%M"),
            type="success"
        ))
    
    # Recent completed tasks (last 7 days)
    recent_tasks = db.query(Task).join(Intern).filter(
        Task.status == TaskStatus.COMPLETED,
        Task.updated_at >= datetime.utcnow() - timedelta(days=7)
    ).order_by(desc(Task.updated_at)).limit(5).all()
    
    for task in recent_tasks:
        activities.append(RecentActivity(
            id=f"task_{task.id}",
            message=f"{task.intern.full_name} completed '{task.title}'",
            timestamp=task.updated_at.strftime("%Y-%m-%d %H:%M"),
            type="success"
        ))
    
    # Overdue tasks
    overdue_tasks = db.query(Task).join(Intern).filter(
        Task.status == TaskStatus.OVERDUE
    ).order_by(desc(Task.deadline)).limit(3).all()
    
    for task in overdue_tasks:
        activities.append(RecentActivity(
            id=f"overdue_{task.id}",
            message=f"Task '{task.title}' is overdue for {task.intern.full_name}",
            timestamp=task.deadline.strftime("%Y-%m-%d"),
            type="warning"
        ))
    
    # Sort by timestamp and return latest 10
    activities.sort(key=lambda x: x.timestamp, reverse=True)
    return activities[:10]

@router.get("/top-performers", response_model=List[TopPerformer])
def get_top_performers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get interns with their task statistics
    interns = db.query(Intern).filter(Intern.status == InternStatus.ACTIVE).all()
    performers = []
    
    for intern in interns:
        tasks = db.query(Task).filter(Task.intern_id == intern.id).all()
        if not tasks:
            continue
            
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t.status == TaskStatus.COMPLETED])
        
        if completed_tasks == 0:
            continue
            
        completion_rate = (completed_tasks / total_tasks) * 100
        
        # Calculate average completion time for completed tasks
        completed_task_times = []
        for task in tasks:
            if task.status == TaskStatus.COMPLETED and task.created_at and task.updated_at:
                completion_time = (task.updated_at - task.created_at).days
                completed_task_times.append(max(1, completion_time))  # At least 1 day
        
        avg_completion_time = sum(completed_task_times) / len(completed_task_times) if completed_task_times else 0
        
        performers.append(TopPerformer(
            id=intern.id,
            name=intern.full_name,
            department=intern.department,
            completedTasks=completed_tasks,
            completionRate=round(completion_rate, 1),
            avgCompletionTime=round(avg_completion_time, 1)
        ))
    
    # Sort by completion rate and then by number of completed tasks
    performers.sort(key=lambda x: (x.completionRate, x.completedTasks), reverse=True)
    return performers[:5]