"""Pydantic response schemas for product and category API outputs"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CategoryResponse(BaseModel):
    """Serialised category returned by category endpoints"""
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class ProductResponse(BaseModel):
    """Serialised product returned by single-product and list endpoints"""
    id: int
    name: str
    description: Optional[str] = None
    price: float
    quantity: int
    image_url: Optional[str] = None
    category_id: int
    category_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    """Paginated product list with total count, current page and page size"""
    items: List[ProductResponse]
    total: int
    page: int
    limit: int