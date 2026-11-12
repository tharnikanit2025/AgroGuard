"""
Authentication API routes: Registration, Login, Demo Login, and Profile
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.models import User
from ..schemas.schemas import UserRegister, UserLogin, UserResponse, Token
from ..utils.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        phone=user_data.phone,
        language=user_data.language or "en",
        location=user_data.location or "Thanjavur, Tamil Nadu"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.user_id), "email": new_user.email})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token({"sub": str(user.user_id), "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/demo-login", response_model=Token)
def demo_login(db: Session = Depends(get_db)):
    """Convenience 1-click Demo Login for Hackathon Judges & Evaluators."""
    demo_user = db.query(User).filter(User.email == "demo_farmer@agroguard.ai").first()
    if not demo_user:
        demo_user = User(
            name="Murugan (Demo Farmer)",
            email="demo_farmer@agroguard.ai",
            password_hash=hash_password("agroguard2026"),
            phone="+91 98401 23456",
            language="ta",
            location="Thanjavur Delta, Tamil Nadu"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    token = create_access_token({"sub": str(demo_user.user_id), "email": demo_user.email})
    return {"access_token": token, "token_type": "bearer", "user": demo_user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
