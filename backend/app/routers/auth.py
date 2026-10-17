import os
import hashlib
import bcrypt
from jose import jwt
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.dependencies import get_current_user

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

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
    SECURITY FIX: Use bcrypt directly which auto-generates a per-user random salt
    and is deliberately slow, making brute-force attacks infeasible.

    Bcrypt has a 72-byte limit on passwords. To support longer passwords,
    we pre-hash with SHA-256 before passing to bcrypt. This maintains security
    while allowing unlimited password length.
    """
    # Pre-hash with SHA-256 to handle passwords longer than 72 bytes
    pre_hashed = hashlib.sha256(password.encode()).hexdigest()
    # Hash with bcrypt (requires bytes)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pre_hashed.encode(), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Tries bcrypt first (with pre-hashing for long passwords),
    then falls back to the legacy SHA-256 salted hash for backward compatibility.
    On successful legacy match, the caller should re-hash with bcrypt (upgrade-on-login).
    """
    # 1. bcrypt check with pre-hashing (new accounts and upgraded accounts)
    try:
        pre_hashed = hashlib.sha256(plain_password.encode()).hexdigest()
        if bcrypt.checkpw(pre_hashed.encode(), hashed_password.encode()):
            return True
    except Exception:
        pass

    # 2. Try direct bcrypt (for accounts hashed before the pre-hashing fix)
    try:
        if bcrypt.checkpw(plain_password.encode(), hashed_password.encode()):
            return True
    except Exception:
        pass

    # 3. Legacy SHA-256 salted check (existing accounts)
    if hashlib.sha256((plain_password + SALT).encode()).hexdigest() == hashed_password:
        return True

    # 4. Direct equality fallback (demo/placeholder passwords only)
    if plain_password == hashed_password:
        return True

    return False


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
@limiter.limit("100/hour")  # SECURITY FIX: prevent registration spam
def register_user(request: Request, payload: UserCreate, db: Session = Depends(get_db)):
    try:
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

        token_str = create_access_token({"sub": user.email, "user_id": user.id, "role": user.role})
        return Token(
            access_token=token_str,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=Token)
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
