from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import json
from config.database import get_db
from app.models.intern import Intern, InternStatus
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/interns", tags=["interns"])

class InternCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    department: str
    position: Optional[str] = None
    university: Optional[str] = None
    skills: Optional[List[str]] = None

class InternUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    university: Optional[str] = None
    skills: Optional[List[str]] = None
    status: Optional[InternStatus] = None

class TaskStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    completion_rate: float

class InternResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    department: str
    position: Optional[str] = None
    university: Optional[str] = None
    skills: Optional[List[str]] = None
    join_date: datetime
    status: InternStatus
    task_stats: Optional[TaskStats] = None
    
    class Config:
        from_attributes = True
        
    @classmethod
    def from_orm(cls, obj, task_stats=None):
        skills = []
        if obj.skills:
            try:
                skills = json.loads(obj.skills)
            except:
                skills = []
        
        return cls(
            id=obj.id,
            full_name=obj.full_name,
            email=obj.email,
            phone=obj.phone,
            department=obj.department,
            position=obj.position,
            university=obj.university,
            skills=skills,
            join_date=obj.join_date,
            status=obj.status,
            task_stats=task_stats
        )

class InternsListResponse(BaseModel):
    interns: List[InternResponse]
    total: int

@router.get("", response_model=InternsListResponse)
def get_interns(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Intern)
    
    if search:
        query = query.filter(
            or_(
                Intern.full_name.ilike(f"%{search}%"),
                Intern.email.ilike(f"%{search}%")
            )
        )
    
    if department:
        query = query.filter(Intern.department == department)
    
    total = query.count()
    interns = query.offset((page - 1) * limit).limit(limit).all()
    
    # Convert to response format with proper skills parsing and task stats
    intern_responses = []
    for intern in interns:
        # Calculate task statistics
        tasks = db.query(Task).filter(Task.intern_id == intern.id).all()
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t.status == TaskStatus.COMPLETED])
        pending_tasks = len([t for t in tasks if t.status == TaskStatus.PENDING])
        overdue_tasks = len([t for t in tasks if t.status == TaskStatus.OVERDUE])
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        task_stats = TaskStats(
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            pending_tasks=pending_tasks,
            overdue_tasks=overdue_tasks,
            completion_rate=round(completion_rate, 1)
        )
        
        intern_responses.append(InternResponse.from_orm(intern, task_stats))
    
    return InternsListResponse(interns=intern_responses, total=total)

@router.get("/{intern_id}", response_model=InternResponse)
def get_intern(
    intern_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    intern = db.query(Intern).filter(Intern.id == intern_id).first()
    if not intern:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intern not found"
        )
    
    # Calculate task statistics
    tasks = db.query(Task).filter(Task.intern_id == intern.id).all()
    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.status == TaskStatus.COMPLETED])
    pending_tasks = len([t for t in tasks if t.status == TaskStatus.PENDING])
    overdue_tasks = len([t for t in tasks if t.status == TaskStatus.OVERDUE])
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    task_stats = TaskStats(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        overdue_tasks=overdue_tasks,
        completion_rate=round(completion_rate, 1)
    )
    
    return InternResponse.from_orm(intern, task_stats)

@router.post("", response_model=InternResponse)
def create_intern(
    intern: InternCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if email already exists
    existing_intern = db.query(Intern).filter(Intern.email == intern.email).first()
    if existing_intern:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    intern_data = intern.dict()
    if intern_data.get('skills'):
        intern_data['skills'] = json.dumps(intern_data['skills'])
    
    db_intern = Intern(**intern_data)
    db.add(db_intern)
    db.commit()
    db.refresh(db_intern)
    return InternResponse.from_orm(db_intern)

@router.put("/{intern_id}", response_model=InternResponse)
def update_intern(
    intern_id: int,
    intern_update: InternUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    intern = db.query(Intern).filter(Intern.id == intern_id).first()
    if not intern:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intern not found"
        )
    
    update_data = intern_update.dict(exclude_unset=True)
    if 'skills' in update_data and update_data['skills'] is not None:
        update_data['skills'] = json.dumps(update_data['skills'])
    
    for field, value in update_data.items():
        setattr(intern, field, value)
    
    db.commit()
    db.refresh(intern)
    return InternResponse.from_orm(intern)

@router.delete("/{intern_id}")
def delete_intern(
    intern_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    intern = db.query(Intern).filter(Intern.id == intern_id).first()
    if not intern:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intern not found"
        )
    
    db.delete(intern)
    db.commit()
    return {"message": "Intern deleted successfully"}