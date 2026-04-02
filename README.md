# 🛒 Gro-Cart – Online Grocery Delivery System

A full-stack online grocery delivery system built with **React + Vite** (frontend) and **Python FastAPI** (backend).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Setup & Running](#setup--running)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Layer    | Technology                               |
|----------|------------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Backend  | Python 3.11+, FastAPI, SQLAlchemy ORM, Pydantic, JWT |
| Database | SQLite (dev) / AWS RDS PostgreSQL or DynamoDB (prod) |
| Auth     | JWT (python-jose) + bcrypt               |

---

## Project Structure

```
grocery-delivery-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Atomic components (Button, Input, Card, Badge, Spinner)
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Route-level pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminProductsPage.jsx
│   │   │   └── AdminOrdersPage.jsx
│   │   ├── services/            # Axios API service layer
│   │   │   ├── api.js           # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useProducts.js
│   │   │   └── useOrders.js
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── __tests__/           # Unit tests (Vitest + Testing Library)
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── api/routes/
│   │   │   ├── auth.py          # POST /auth/register, /auth/login, GET /auth/me
│   │   │   ├── products.py      # GET /products, /products/{id}, /categories
│   │   │   ├── cart.py          # GET/POST/PUT/DELETE /cart/*
│   │   │   ├── orders.py        # POST /orders/place, GET /orders/history
│   │   │   └── admin.py         # Admin product & order management
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── cart.py
│   │   │   └── order.py
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── services/            # Business logic layer
│   │   ├── database/
│   │   │   ├── connection.py    # DB engine + session factory
│   │   │   └── base.py          # SQLAlchemy declarative base
│   │   ├── core/
│   │   │   ├── config.py        # App settings (env vars)
│   │   │   └── security.py      # JWT + bcrypt helpers
│   │   └── utils/
│   │
│   ├── tests/                   # pytest unit tests
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_products.py
│   │   ├── test_cart.py
│   │   └── test_orders.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## Database Schema

### `users`
| Column        | Type    | Notes                |
|---------------|---------|----------------------|
| id            | INTEGER | PK, auto-increment   |
| name          | VARCHAR | required             |
| email         | VARCHAR | unique, required     |
| hashed_password | VARCHAR | bcrypt hash        |
| phone_number  | VARCHAR | optional             |
| address       | TEXT    | optional             |
| date_of_birth | DATE    | optional             |
| is_admin      | BOOLEAN | default false        |
| created_at    | DATETIME| auto                 |

### `categories`
| Column      | Type    | Notes              |
|-------------|---------|--------------------|
| id          | INTEGER | PK                 |
| name        | VARCHAR | unique, required   |
| description | TEXT    | optional           |

### `products`
| Column      | Type    | Notes                |
|-------------|---------|----------------------|
| id          | INTEGER | PK                   |
| name        | VARCHAR | required             |
| description | TEXT    | optional             |
| price       | FLOAT   | required             |
| quantity    | INTEGER | stock count          |
| image_url   | VARCHAR | optional             |
| category_id | INTEGER | FK → categories.id   |
| created_at  | DATETIME| auto                 |

### `cart_items`
| Column     | Type    | Notes                |
|------------|---------|----------------------|
| id         | INTEGER | PK                   |
| user_id    | INTEGER | FK → users.id        |
| product_id | INTEGER | FK → products.id     |
| quantity   | INTEGER | required             |
| created_at | DATETIME| auto                 |

### `orders`
| Column           | Type    | Notes                              |
|------------------|---------|------------------------------------|
| id               | INTEGER | PK                                 |
| user_id          | INTEGER | FK → users.id                      |
| status           | ENUM    | pending/in_progress/packed/out_for_delivery/delivered |
| delivery_address | TEXT    | required                           |
| payment_method   | VARCHAR | required                           |
| total_amount     | FLOAT   | calculated at placement            |
| created_at       | DATETIME| auto                               |

### `order_items`
| Column     | Type    | Notes               |
|------------|---------|---------------------|
| id         | INTEGER | PK                  |
| order_id   | INTEGER | FK → orders.id      |
| product_id | INTEGER | FK → products.id    |
| quantity   | INTEGER | required            |
| unit_price | FLOAT   | snapshot at purchase|

---

## API Endpoints

### Auth
| Method | Path             | Auth | Description        |
|--------|------------------|------|--------------------|
| POST   | /auth/register   | —    | Register new user  |
| POST   | /auth/login      | —    | Login, get JWT     |
| GET    | /auth/me         | JWT  | Get current user   |

### Products
| Method | Path              | Auth | Description           |
|--------|-------------------|------|-----------------------|
| GET    | /products         | —    | List products         |
| GET    | /products/{id}    | —    | Get product details   |
| GET    | /categories       | —    | List categories       |

### Cart
| Method | Path              | Auth | Description       |
|--------|-------------------|------|-------------------|
| GET    | /cart             | JWT  | View cart         |
| POST   | /cart/add         | JWT  | Add item to cart  |
| PUT    | /cart/update/{id} | JWT  | Update quantity   |
| DELETE | /cart/remove/{id} | JWT  | Remove item       |
| DELETE | /cart/clear       | JWT  | Clear entire cart |

### Orders
| Method | Path              | Auth | Description        |
|--------|-------------------|------|--------------------|
| POST   | /orders/place     | JWT  | Place order        |
| GET    | /orders/history   | JWT  | Get order history  |

### Admin
| Method | Path                        | Auth       | Description           |
|--------|-----------------------------|------------|-----------------------|
| POST   | /admin/categories           | JWT+Admin  | Create category       |
| POST   | /admin/products             | JWT+Admin  | Create product        |
| PUT    | /admin/products/{id}        | JWT+Admin  | Update product        |
| DELETE | /admin/products/{id}        | JWT+Admin  | Delete product        |
| GET    | /admin/orders               | JWT+Admin  | List all orders       |
| PUT    | /admin/orders/{id}/status   | JWT+Admin  | Update order status   |

---

## Setup & Running

### Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database URL, secret key, etc.

# Start the server
uvicorn app.main:app --reload
```
If you want to change the BE endpoint, change it at this location - frontend/.env.example
Backend runs on: **http://localhost:8000**

API docs (Swagger UI): **http://localhost:8000/docs**

ReDoc: **http://localhost:8000/redoc**

---

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit VITE_API_URL if backend runs on a different port

# Start the development server
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## Testing

### Backend tests (pytest)

```bash
cd backend
pytest tests/ -v
```

### Frontend tests (Vitest)

```bash
cd frontend
npm test
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL=sqlite:///./grocart.db
# For AWS RDS PostgreSQL:
# DATABASE_URL=postgresql://user:password@your-rds-endpoint:5432/grocart

# JWT
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:5173
```

#### AWS RDS (PostgreSQL) configuration

Replace `DATABASE_URL` with:
```env
DATABASE_URL=postgresql://username:password@your-rds-instance.region.rds.amazonaws.com:5432/grocart
```

#### AWS DynamoDB (alternative)

Install `boto3` and switch the `database/connection.py` to use DynamoDB via the AWS SDK.
Required environment variables:
```env
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
DYNAMODB_TABLE_PREFIX=grocart_
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

---

## Features

### Customer
- Register / Login / Logout (JWT auth)
- Browse products by category
- View product details
- Cart: add, update quantity, remove items, clear
- Checkout with delivery address and payment method selection
- View order history with status tracking

### Admin
- Create, edit, and delete products
- Manage product categories
- View all orders
- Update order status: Pending → In Progress → Packed → Out for Delivery → Delivered
