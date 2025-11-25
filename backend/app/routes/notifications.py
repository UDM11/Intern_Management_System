from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from app.models.notification import Notification
from typing import List
from pydantic import BaseModel

router = APIRouter()

class NotificationResponse(BaseModel):
    id: int
    type: str
    title: str
    message: str
    is_read: bool
    created_at: str
    priority: str

@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(db: Session = Depends(get_db)):
    notifications = db.query(Notification).order_by(Notification.created_at.desc()).limit(50).all()
    return [
        NotificationResponse(
            id=n.id,
            type=n.type,
            title=n.title,
            message=n.message,
            is_read=n.is_read,
            created_at=n.created_at.isoformat(),
            priority=n.priority
        ) for n in notifications
    ]

@router.get("/unread-count")
async def get_unread_count(db: Session = Depends(get_db)):
    count = db.query(Notification).filter(Notification.is_read == False).count()
    return {"count": count}

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}

@router.put("/mark-all-read")
async def mark_all_as_read(db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

def create_notification(db: Session, type: str, title: str, message: str, priority: str = "medium"):
    notification = Notification(
        type=type,
        title=title,
        message=message,
        priority=priority
    )
    db.add(notification)
    db.commit()
    return notification