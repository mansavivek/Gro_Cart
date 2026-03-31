from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.order import Order, OrderItem, OrderStatus
from app.models.cart import CartItem
from app.schemas.order import OrderPlace, OrderStatusUpdate


def place_order(db: Session, user_id: int, order_data: OrderPlace) -> Order:
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    total_amount = sum(item.product.price * item.quantity for item in cart_items if item.product)

    order = Order(
        user_id=user_id,
        delivery_address=order_data.delivery_address,
        payment_method=order_data.payment_method,
        total_amount=round(total_amount, 2),
        status=OrderStatus.PENDING,
    )
    db.add(order)
    db.flush()

    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            unit_price=cart_item.product.price,
        )
        db.add(order_item)

    # Clear cart after placing order
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()
    db.refresh(order)
    return order


def get_order_history(db: Session, user_id: int) -> List[Order]:
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()


def get_all_orders(db: Session) -> List[Order]:
    return db.query(Order).order_by(Order.created_at.desc()).all()


def update_order_status(db: Session, order_id: int, status_data: OrderStatusUpdate) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order.status = status_data.status
    db.commit()
    db.refresh(order)
    return order
