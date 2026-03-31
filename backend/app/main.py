from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.connection import engine
from app.database.base import Base
import app.models  # noqa: F401 – registers all ORM models

from app.api.routes import auth, products, cart, orders, admin

# Create all tables on startup (development convenience)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Online Grocery Delivery System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS – allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/", tags=["Health"])
def root():
    return {"message": f"Welcome to {settings.APP_NAME} API", "docs": "/docs"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
