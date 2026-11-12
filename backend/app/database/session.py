"""
Database session management.
Using SQLite for prototype, structured for straightforward PostgreSQL migration.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Path to database file
DB_DIR = os.path.dirname(os.path.abspath(__file__))
# agroguard-ai/backend/agroguard.db
DB_PATH = os.path.abspath(os.path.join(DB_DIR, "..", "..", "agroguard.db"))
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# connect_args={"check_same_thread": False} is required for SQLite in FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
