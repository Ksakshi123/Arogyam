from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

from app.database import get_db
from app.models.user import User
from app.models.patient import PatientProfile
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.dependencies import get_current_user

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "arogyam_super_secret_jwt_key_replace_in_production_2024")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


import hashlib

SALT = "arogyam_salt_2024"


def get_password_hash(password: str) -> str:
    """
    Consistent SHA-256 salted hash matching frontend authentication layer.
    """
    return hashlib.sha256((password + SALT).encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies passwords against salted SHA-256 or bcrypt hash.
    """
    # 1. Salted SHA-256 check
    if hashlib.sha256((plain_password + SALT).encode()).hexdigest() == hashed_password:
        return True

    # 2. Direct equality check
    if plain_password == hashed_password:
        return True

    # 3. Bcrypt fallback
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    hashed = get_password_hash(payload.password)
    user = User(
        name=payload.name or email_clean.split("@")[0],
        email=email_clean,
        password_hash=hashed,
        role=payload.role or "patient",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Automatically create empty PatientProfile if role is patient
    if user.role == "patient":
        profile = PatientProfile(
            user_id=user.id,
            activity_level="Moderately Active",
            diet_preference="Vegetarian",
            wellness_goals=["General Wellness"],
            allergies=[],
            food_restrictions=[],
            disliked_foods=[],
        )
        db.add(profile)
        db.commit()

    token_str = create_access_token({"sub": user.email, "user_id": user.id, "role": user.role})
    return Token(
        access_token=token_str,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=Token)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()

    # Demo account auto-seeding if requested
    if not user and email_clean == "demo@arogyam.com":
        hashed = get_password_hash("arogyam123")
        user = User(
            name="Aarav Sharma",
            email=email_clean,
            password_hash=hashed,
            role="patient"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        demo_profile = PatientProfile(
            user_id=user.id,
            age=29,
            weight=68.0,
            height=175.0,
            activity_level="Moderately Active",
            diet_preference="Vegetarian",
            wellness_goals=["Improve Digestion", "Improve Energy", "Muscle Support"],
            allergies=[],
            food_restrictions=[],
            disliked_foods=[],
        )
        db.add(demo_profile)
        db.commit()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token_str = create_access_token({"sub": user.email, "user_id": user.id, "role": user.role})
    return Token(
        access_token=token_str,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
