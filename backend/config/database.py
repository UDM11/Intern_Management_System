from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./intern_management.db")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

settings = Settings()

# Database engine configuration
if settings.database_url.startswith("postgresql"):
    # PostgreSQL for production (Render)
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False
    )
    print("Connected to PostgreSQL database")
elif settings.database_url.startswith("mysql"):
    # MySQL configuration
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False
    )
    print("Connected to MySQL database")
else:
    # SQLite for development
    engine = create_engine(
        settings.database_url,
        connect_args={"check_same_thread": False},
        echo=False
    )
    print("Connected to SQLite database")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()