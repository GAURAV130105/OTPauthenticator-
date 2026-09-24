from fastapi import APIRouter, Depends
from models import User
from auth import get_current_user
from schemas import UserInfo

router = APIRouter(prefix="/api/protected", tags=["protected"])

@router.get("/dashboard")
def get_dashboard(current_user: User = Depends(get_current_user)):
    """Protected dashboard endpoint."""
    return {
        "message": "Welcome to your dashboard!",
        "email": current_user.email,
        "status": "authenticated"
    }

@router.get("/profile", response_model=UserInfo)
def get_profile(current_user: User = Depends(get_current_user)):
    """Protected profile endpoint."""
    return current_user
