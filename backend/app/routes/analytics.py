from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from config.database import get_db
from app.models.intern import Intern, InternStatus
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

class DepartmentStat(BaseModel):
    name: str
    value: int
    color: str

class MonthlyGrowth(BaseModel):
    month: str
    interns: int
    tasks: int

class PerformanceMetric(BaseModel):
    department: str
    completion: float
    efficiency: float

class RecentActivity(BaseModel):
    date: str
    active: int
    joined: int
    completed: int

class AnalyticsData(BaseModel):
    totalInterns: int
    activeInterns: int
    inactiveInterns: int
    completedTasks: int
    pendingTasks: int
    overdueTasks: int
    departmentStats: List[DepartmentStat]
    monthlyGrowth: List[MonthlyGrowth]
    performanceMetrics: List[PerformanceMetric]
    recentActivity: List[RecentActivity]

@router.get("", response_model=AnalyticsData)
def get_analytics_data(
    timeRange: str = Query("30d"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Parse time range
    days_map = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}
    days = days_map.get(timeRange, 30)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Basic stats
    total_interns = db.query(Intern).count()
    active_interns = db.query(Intern).filter(Intern.status == InternStatus.ACTIVE).count()
    inactive_interns = total_interns - active_interns
    
    completed_tasks = db.query(Task).filter(Task.status == TaskStatus.COMPLETED).count()
    pending_tasks = db.query(Task).filter(Task.status == TaskStatus.PENDING).count()
    overdue_tasks = db.query(Task).filter(Task.status == TaskStatus.OVERDUE).count()
    
    # Department stats
    dept_colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
    dept_stats = db.query(
        Intern.department,
        func.count(Intern.id).label('count')
    ).group_by(Intern.department).all()
    
    department_stats = [
        DepartmentStat(
            name=dept,
            value=count,
            color=dept_colors[i % len(dept_colors)]
        )
        for i, (dept, count) in enumerate(dept_stats)
    ]
    
    # Monthly growth (last 6 months)
    monthly_growth = []
    for i in range(6):
        month_start = datetime.utcnow().replace(day=1) - timedelta(days=30*i)
        month_end = month_start + timedelta(days=30)
        
        interns_count = db.query(Intern).filter(
            Intern.created_at >= month_start,
            Intern.created_at < month_end
        ).count()
        
        tasks_count = db.query(Task).filter(
            Task.created_at >= month_start,
            Task.created_at < month_end
        ).count()
        
        monthly_growth.append(MonthlyGrowth(
            month=month_start.strftime("%b %Y"),
            interns=interns_count,
            tasks=tasks_count
        ))
    
    monthly_growth.reverse()
    
    # Performance metrics by department
    performance_metrics = []
    for dept, _ in dept_stats:
        dept_interns = db.query(Intern).filter(Intern.department == dept).all()
        if not dept_interns:
            continue
            
        total_tasks = 0
        completed_tasks_dept = 0
        total_completion_time = 0
        completed_with_time = 0
        
        for intern in dept_interns:
            tasks = db.query(Task).filter(Task.intern_id == intern.id).all()
            total_tasks += len(tasks)
            
            for task in tasks:
                if task.status == TaskStatus.COMPLETED:
                    completed_tasks_dept += 1
                    if task.created_at and task.updated_at:
                        completion_time = (task.updated_at - task.created_at).days
                        total_completion_time += max(1, completion_time)
                        completed_with_time += 1
        
        completion_rate = (completed_tasks_dept / total_tasks * 100) if total_tasks > 0 else 0
        avg_completion_time = (total_completion_time / completed_with_time) if completed_with_time > 0 else 0
        efficiency = (100 - min(avg_completion_time * 10, 100)) if avg_completion_time > 0 else 0
        
        performance_metrics.append(PerformanceMetric(
            department=dept,
            completion=round(completion_rate, 1),
            efficiency=round(efficiency, 1)
        ))
    
    # Recent activity (last 7 days)
    recent_activity = []
    for i in range(7):
        date = datetime.utcnow().date() - timedelta(days=i)
        date_start = datetime.combine(date, datetime.min.time())
        date_end = datetime.combine(date, datetime.max.time())
        
        active_count = db.query(Intern).filter(
            Intern.status == InternStatus.ACTIVE,
            Intern.updated_at >= date_start,
            Intern.updated_at <= date_end
        ).count()
        
        joined_count = db.query(Intern).filter(
            Intern.created_at >= date_start,
            Intern.created_at <= date_end
        ).count()
        
        completed_count = db.query(Task).filter(
            Task.status == TaskStatus.COMPLETED,
            Task.updated_at >= date_start,
            Task.updated_at <= date_end
        ).count()
        
        recent_activity.append(RecentActivity(
            date=date.strftime("%Y-%m-%d"),
            active=active_count,
            joined=joined_count,
            completed=completed_count
        ))
    
    recent_activity.reverse()
    
    return AnalyticsData(
        totalInterns=total_interns,
        activeInterns=active_interns,
        inactiveInterns=inactive_interns,
        completedTasks=completed_tasks,
        pendingTasks=pending_tasks,
        overdueTasks=overdue_tasks,
        departmentStats=department_stats,
        monthlyGrowth=monthly_growth,
        performanceMetrics=performance_metrics,
        recentActivity=recent_activity
    )