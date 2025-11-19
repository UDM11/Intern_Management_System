from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/intern_management")
    mysql_host: str = os.getenv("MYSQL_HOST", "localhost")
    mysql_port: int = int(os.getenv("MYSQL_PORT", "3306"))
    mysql_user: str = os.getenv("MYSQL_USER", "root")
    mysql_password: str = os.getenv("MYSQL_PASSWORD", "password")
    mysql_database: str = os.getenv("MYSQL_DATABASE", "intern_management")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

settings = Settings()

# Try MySQL first, fallback to SQLite
try:
    if settings.database_url.startswith("mysql") and "YOUR_MYSQL_PASSWORD" not in settings.database_url:
        engine = create_engine(
            settings.database_url,
            pool_pre_ping=True,
            pool_recycle=300,
            echo=False
        )
        # Test connection
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        print("Connected to MySQL database")
    else:
        raise Exception("MySQL not configured or placeholder password found")
except Exception as e:
    print(f"MySQL connection failed: {str(e)[:100]}...")
    print("Falling back to SQLite database")
    engine = create_engine(
        "sqlite:///./intern_management.db",
        connect_args={"check_same_thread": False},
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()