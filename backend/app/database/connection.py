"""Database connection factory: opens a new MySQL connection using credentials from .env"""

import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def get_db():
    """Return a new MySQL connection; caller is responsible for closing it"""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )