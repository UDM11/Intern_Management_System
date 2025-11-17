from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from config.database import get_db
from app.models.intern import Intern, InternStatus
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/interns", tags=["interns"])

class InternCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    department: str

class InternUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    status: Optional[InternStatus] = None

class InternResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    department: str
    join_date: datetime
    status: InternStatus
    
    class Config:
        from_attributes = True

class InternsListResponse(BaseModel):
    interns: List[InternResponse]
    total: int

@router.get("/", response_model=InternsListResponse)
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
    
    return InternsListResponse(interns=interns, total=total)

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
    return intern

@router.post("/", response_model=InternResponse)
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
    
    db_intern = Intern(**intern.dict())
    db.add(db_intern)
    db.commit()
    db.refresh(db_intern)
    return db_intern

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
    for field, value in update_data.items():
        setattr(intern, field, value)
    
    db.commit()
    db.refresh(intern)
    return intern

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