"""SQLAlchemy ORM model for the products table; SKU is the primary key"""

from sqlalchemy import Column, String, Float, Text, Integer, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class Product(Base):
    __tablename__ = "products"

    sku = Column(String(100), primary_key=True, index=True) 

    name = Column(String(255), nullable=False)
    price = Column(Float)

    currency = Column(String(10), default="USD")
    availability = Column(String(20)) 

    description = Column(Text)
    brand = Column(String(100))

    breadcrumbs = Column(Text)
    images = Column(Text) 

    avg_rating = Column(Float)
    reviews_count = Column(Integer)

    pack_size = Column(String(50))

    ingredients = Column(Text)
    storage_details = Column(Text)

    percentage_alcohol = Column(Float)
    serving_size = Column(String(50))

    nutrition = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())