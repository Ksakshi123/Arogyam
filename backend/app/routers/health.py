from fastapi import APIRouter

router = APIRouter()


@router.get("/health", summary="Service Health Check")
def health_check():
    """
    Health check endpoint to verify backend service liveness.
    """
    return {
        "status": "ok",
        "service": "Arogyam API"
    }

