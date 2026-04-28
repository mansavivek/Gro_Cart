"""SQLAlchemy ORM model for the categories table"""

from sqlalchemy import Column, Integer, String, Text
from app.database.base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)