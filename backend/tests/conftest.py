import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.base import Base
from app.database.connection import get_db

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def registered_user(client):
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "phone_number": "1234567890",
        "address": "123 Test St",
    }
    client.post("/auth/register", json=payload)
    return payload


@pytest.fixture
def auth_headers(client, registered_user):
    resp = client.post(
        "/auth/login",
        json={"email": registered_user["email"], "password": registered_user["password"]},
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers(client):
    from app.database.connection import SessionLocal
    from app.models.user import User
    from app.core.security import get_password_hash

    db = TestingSessionLocal()
    admin = User(
        name="Admin",
        email="admin@example.com",
        hashed_password=get_password_hash("adminpass"),
        is_admin=True,
    )
    db.add(admin)
    db.commit()
    db.close()

    resp = client.post("/auth/login", json={"email": "admin@example.com", "password": "adminpass"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
