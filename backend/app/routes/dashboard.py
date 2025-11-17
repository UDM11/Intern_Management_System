from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from config.database import get_db
from app.models.intern import Intern, InternStatus
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

class DashboardStats(BaseModel):
    total_interns: int
    active_interns: int
    pending_tasks: int
    completed_tasks: int
    overdue_tasks: int

class DepartmentStats(BaseModel):
    department: str
    intern_count: int

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_interns = db.query(Intern).count()
    active_interns = db.query(Intern).filter(Intern.status == InternStatus.ACTIVE).count()
    pending_tasks = db.query(Task).filter(Task.status == TaskStatus.PENDING).count()
    completed_tasks = db.query(Task).filter(Task.status == TaskStatus.COMPLETED).count()
    overdue_tasks = db.query(Task).filter(Task.status == TaskStatus.OVERDUE).count()
    
    return DashboardStats(
        total_interns=total_interns,
        active_interns=active_interns,
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