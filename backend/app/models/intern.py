from sqlalchemy import Column, Integer, String, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from config.database import Base
from datetime import datetime
import enum

class InternStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Intern(Base):
    __tablename__ = "interns"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    department = Column(String(50), nullable=False)
    join_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(InternStatus), default=InternStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tasks = relationship("Task", back_populates="intern", cascade="all, delete-orphan")