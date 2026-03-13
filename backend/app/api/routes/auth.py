from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import UserCreate, Token, LoginRequest, UserResponse
from app.services.auth_service import create_user, authenticate_user
from app.core.security import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new customer account."""
    return create_user(db, user_data)


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password, returns JWT token."""
    return authenticate_user(db, login_data.email, login_data.password)


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    """Get current authenticated user details."""
    return current_user
