from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.product import ProductResponse, CategoryResponse
from app.services.product_service import get_all_products, get_product_by_id, get_all_categories

router = APIRouter(tags=["Products"])


@router.get("/products", response_model=List[ProductResponse])
def list_products(
    category_id: Optional[int] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db),
):
    """List all products, optionally filtered by category."""
    return get_all_products(db, category_id)


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID."""
    return get_product_by_id(db, product_id)


@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """List all product categories."""
    return get_all_categories(db)
