from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryResponse
from app.schemas.order import OrderResponse, OrderStatusUpdate
from app.services.product_service import create_product, update_product, delete_product, create_category
from app.services.order_service import get_all_orders, update_order_status
from app.core.security import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/products", response_model=ProductResponse, status_code=201)
def admin_create_product(
    product_data: ProductCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin: Add a new product."""
    return create_product(db, product_data)


@router.put("/products/{product_id}", response_model=ProductResponse)
def admin_update_product(
    product_id: int,
    product_data: ProductUpdate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin: Update product details (price, quantity, etc.)."""
    return update_product(db, product_id, product_data)


@router.delete("/products/{product_id}", status_code=204)
def admin_delete_product(
    product_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin: Remove a product."""
    delete_product(db, product_id)


@router.post("/categories", response_model=CategoryResponse, status_code=201)
def admin_create_category(
    category_data: CategoryCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin: Add a new product category."""
    return create_category(db, category_data.name, category_data.description, category_data.image_url)


@router.get("/orders", response_model=List[OrderResponse])
def admin_list_orders(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin: View all orders."""
    return get_all_orders(db)


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def admin_update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin: Update order status."""
    return update_order_status(db, order_id, status_data)
