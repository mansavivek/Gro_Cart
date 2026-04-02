from flask import Flask
from flask_cors import CORS
from app.routes.auth import auth_routes
from app.routes.products import product_routes
from app.routes.categories import category_routes
from app.routes.cart import cart_routes
from app.routes.orders import order_routes

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ]
        }
    },
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# register routes
app.register_blueprint(auth_routes, url_prefix="/auth")
app.register_blueprint(product_routes, url_prefix="/products")
app.register_blueprint(category_routes, url_prefix="/categories")
app.register_blueprint(cart_routes, url_prefix="/cart")
app.register_blueprint(order_routes, url_prefix="/orders")

if __name__ == "__main__":
    app.run(debug=True, port=8000)