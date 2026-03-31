from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartResponse


def get_cart(db: Session, user_id: int) -> CartResponse:
    items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    total_price = sum(item.product.price * item.quantity for item in items if item.product)
    return CartResponse(
        items=items,
        total_items=len(items),
        total_price=round(total_price, 2),
    )


def add_to_cart(db: Session, user_id: int, product_id: int, quantity: int) -> CartItem:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if product.quantity < quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock")

    existing = db.query(CartItem).filter(
        CartItem.user_id == user_id, CartItem.product_id == product_id
    ).first()

    if existing:
        existing.quantity += quantity
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


def update_cart_item(db: Session, user_id: int, item_id: int, quantity: int) -> CartItem:
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.user_id == user_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    if quantity <= 0:
        db.delete(item)
        db.commit()
        raise HTTPException(status_code=status.HTTP_200_OK, detail="Item removed")
    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return item


def remove_from_cart(db: Session, user_id: int, item_id: int) -> None:
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.user_id == user_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    db.delete(item)
    db.commit()


def clear_cart(db: Session, user_id: int) -> None:
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()
