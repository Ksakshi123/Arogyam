from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

router = APIRouter()


@router.get("/test", summary="Test PostgreSQL Database Connection")
def test_database_connection(db: Session = Depends(get_db)):
    """
    Tests actual PostgreSQL connection by executing 'SELECT 1'.
    Returns success if query executes, or HTTP 500 if connection fails.
    """
    try:
        result = db.execute(text("SELECT 1")).scalar()
        if result == 1:
            return {
                "status": "success",
                "database": "PostgreSQL connected successfully"
            }
        else:
            raise Exception(f"Unexpected query result: {result}")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "database": "Database connection failed",
                "error": str(e)
            }
        )
