from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.product import ProductResponse


class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemAdd(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    created_at: datetime
    product: Optional[ProductResponse] = None

    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total_items: int
    total_price: float
