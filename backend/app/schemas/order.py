from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.order import OrderStatus
from app.schemas.product import ProductResponse


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product: Optional[ProductResponse] = None

    model_config = {"from_attributes": True}


class OrderPlace(BaseModel):
    delivery_address: str
    payment_method: str


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderResponse(BaseModel):
    id: int
    user_id: int
    delivery_address: str
    payment_method: str
    status: OrderStatus
    total_amount: float
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    model_config = {"from_attributes": True}
