"""
Database Models for Gro-Cart

Table Structure:
  users: id, name, email, phone_number, address, date_of_birth, hashed_password, is_admin, created_at
"""
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), nullable=True)
    address = Column(String(500), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
