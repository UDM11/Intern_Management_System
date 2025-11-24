from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import uuid
from config.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user, get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    full_name: Optional[str] = None

class UserProfile(BaseModel):
    id: int
    username: str
    email: str
    phone: Optional[str] = None
    department: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool

@router.get("/")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all users"""
    users = db.query(User).all()
    return [{"id": user.id, "username": user.username, "email": user.email, "is_active": user.is_active} for user in users]

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": f"User {user.username} deleted successfully"}

@router.get("/profile", response_model=UserProfile)
def get_current_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    try:
        return UserProfile(
            id=current_user.id,
            username=current_user.username,
            email=current_user.email,
            phone=getattr(current_user, 'phone', None),
            department=getattr(current_user, 'department', None),
            full_name=getattr(current_user, 'full_name', None),
            avatar_url=getattr(current_user, 'avatar_url', None),
            is_active=current_user.is_active
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting profile: {str(e)}")

@router.put("/profile", response_model=UserProfile)
def update_user_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        update_data = profile_data.dict(exclude_unset=True)
        
        # Check if email is already taken by another user
        if 'email' in update_data:
            existing_user = db.query(User).filter(
                User.email == update_data['email'],
                User.id != current_user.id
            ).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if username is already taken by another user
        if 'username' in update_data:
            existing_user = db.query(User).filter(
                User.username == update_data['username'],
                User.id != current_user.id
            ).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Username already taken")
        
        # Update user fields safely
        for field, value in update_data.items():
            if hasattr(current_user, field):
                setattr(current_user, field, value)
        
        db.commit()
        db.refresh(current_user)
        
        return UserProfile(
            id=current_user.id,
            username=current_user.username,
            email=current_user.email,
            phone=getattr(current_user, 'phone', None),
            department=getattr(current_user, 'department', None),
            full_name=getattr(current_user, 'full_name', None),
            avatar_url=getattr(current_user, 'avatar_url', None),
            is_active=current_user.is_active
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating profile: {str(e)}")

@router.post("/profile/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload user avatar"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate file size (2MB max)
        if file.size and file.size > 2 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size must be less than 2MB")
        
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads/avatars"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        import uuid
        file_extension = file.filename.split('.')[-1] if file.filename else 'jpg'
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
        
        # Update user avatar URL
        avatar_url = f"/uploads/avatars/{filename}"
        if hasattr(current_user, 'avatar_url'):
            current_user.avatar_url = avatar_url
            db.commit()
        
        return {"avatar_url": avatar_url}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading avatar: {str(e)}")

@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"id": user.id, "username": user.username, "email": user.email, "is_active": user.is_active}