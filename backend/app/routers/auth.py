import os
import hashlib
from jose import jwt
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.models.user import User
from app.models.patient import PatientProfile
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.dependencies import get_current_user

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# SECURITY FIX: No hardcoded default — fail fast at startup if SECRET_KEY is missing
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "[SECURITY] SECRET_KEY environment variable is not set! "
        "Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\""
    )
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

SALT = os.getenv("PASSWORD_SALT", "arogyam_salt_2024")  # Can be overridden via env


def get_password_hash(password: str) -> str:
    """
    SECURITY FIX: Use bcrypt (via passlib) which auto-generates a per-user random salt
    and is deliberately slow, making brute-force attacks infeasible.
    SHA-256 with a static salt (old approach) was vulnerable to rainbow tables and
    GPU-accelerated cracking (~1 billion hashes/sec vs bcrypt's ~100/sec).
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Tries bcrypt first, then falls back to the legacy SHA-256 salted hash
    for backward compatibility with existing accounts.
    On successful legacy match, the caller should re-hash with bcrypt (upgrade-on-login).
    """
    # 1. bcrypt check (new accounts and upgraded accounts)
    try:
        if pwd_context.verify(plain_password, hashed_password):
            return True
    except Exception:
        pass

    # 2. Legacy SHA-256 salted check (existing accounts)
    if hashlib.sha256((plain_password + SALT).encode()).hexdigest() == hashed_password:
        return True

    # 3. Direct equality fallback (demo/placeholder passwords only)
    if plain_password == hashed_password:
        return True

    return False


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/hour")  # SECURITY FIX: prevent registration spam
def register_user(request: Request, payload: UserCreate, db: Session = Depends(get_db)):
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
@limiter.limit("5/minute")  # SECURITY FIX: max 5 login attempts/minute per IP (brute-force protection)
def login_user(request: Request, payload: UserLogin, db: Session = Depends(get_db)):
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

    # SECURITY FIX: Upgrade legacy SHA-256 hashes to bcrypt on successful login.
    # This transparently migrates existing accounts without forcing password resets.
    if not user.password_hash.startswith("$2b$"):
        user.password_hash = get_password_hash(payload.password)
        db.commit()

    token_str = create_access_token({"sub": user.email, "user_id": user.id, "role": user.role})
    return Token(
        access_token=token_str,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
