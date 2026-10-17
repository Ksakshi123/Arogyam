"""
Authentication utilities – password hashing and JWT token creation.
"""
import hashlib
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_password(password: str) -> str:
    """
    Hash password using bcrypt with pre-hashing to support unlimited password length.
    Bcrypt has a 72-byte limit, so we pre-hash with SHA-256 first.
    """
    # Pre-hash with SHA-256 to handle passwords longer than 72 bytes
    pre_hashed = hashlib.sha256(password.encode()).hexdigest()
    # Hash with bcrypt (requires bytes)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pre_hashed.encode(), salt)
    return hashed.decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    """
    Verify password using bcrypt with pre-hashing for backward compatibility.
    """
    # Try with pre-hashing (new method)
    try:
        pre_hashed = hashlib.sha256(plain.encode()).hexdigest()
        return bcrypt.checkpw(pre_hashed.encode(), hashed.encode())
    except Exception:
        pass

    # Try direct bcrypt (for backward compatibility with old hashes)
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        pass

    return False


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
