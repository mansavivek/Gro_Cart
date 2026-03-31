from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.order import OrderPlace, OrderResponse
from app.services.order_service import place_order, get_order_history
from app.core.security import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/place", response_model=OrderResponse, status_code=201)
def create_order(
    order_data: OrderPlace,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Place a new order from current cart."""
    return place_order(db, current_user.id, order_data)


@router.get("/history", response_model=List[OrderResponse])
def order_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get order history for current user."""
    return get_order_history(db, current_user.id)
