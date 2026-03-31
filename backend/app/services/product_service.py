from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.product import Product, Category
from app.schemas.product import ProductCreate, ProductUpdate


def get_all_products(db: Session, category_id: Optional[int] = None) -> List[Product]:
    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    return query.all()


def get_product_by_id(db: Session, product_id: int) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


def get_all_categories(db: Session) -> List[Category]:
    return db.query(Category).all()


def create_product(db: Session, product_data: ProductCreate) -> Product:
    product = Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, product_data: ProductUpdate) -> Product:
    product = get_product_by_id(db, product_id)
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> None:
    product = get_product_by_id(db, product_id)
    db.delete(product)
    db.commit()


def create_category(db: Session, name: str, description: Optional[str] = None,
                    image_url: Optional[str] = None) -> Category:
    existing = db.query(Category).filter(Category.name == name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")
    category = Category(name=name, description=description, image_url=image_url)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
