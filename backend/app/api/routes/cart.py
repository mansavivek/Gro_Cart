from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.cart import CartResponse, CartItemAdd, CartItemUpdate, CartItemResponse
from app.services.cart_service import (
    get_cart, add_to_cart, update_cart_item, remove_from_cart, clear_cart
)
from app.core.security import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=CartResponse)
def view_cart(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's cart."""
    return get_cart(db, current_user.id)


@router.post("/add", response_model=CartItemResponse, status_code=201)
def add_item(
    item: CartItemAdd,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a product to cart."""
    return add_to_cart(db, current_user.id, item.product_id, item.quantity)


@router.put("/update/{item_id}", response_model=CartItemResponse)
def update_item(
    item_id: int,
    update_data: CartItemUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update quantity of a cart item."""
    return update_cart_item(db, current_user.id, item_id, update_data.quantity)


@router.delete("/remove/{item_id}", status_code=204)
def remove_item(
    item_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove an item from cart."""
    remove_from_cart(db, current_user.id, item_id)


@router.delete("/clear", status_code=204)
def clear_user_cart(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Clear all items from cart."""
    clear_cart(db, current_user.id)
