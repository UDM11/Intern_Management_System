from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from config.database import Base
from datetime import datetime

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20), nullable=False)  # 'intern_created', 'task_assigned', etc.
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    priority = Column(String(10), default='medium')  # 'low', 'medium', 'high'