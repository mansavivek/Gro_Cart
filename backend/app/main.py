from flask import Flask
from flask_cors import CORS
from app.routes.auth import auth_routes
from app.routes.products import product_routes
from app.routes.categories import category_routes
from app.routes.cart import cart_routes
from app.routes.orders import order_routes
from app.routes.address_routes import address_routes
from app.routes.payment_routes import payment_routes

app = Flask(__name__)

CORS(app)

# register routes
app.register_blueprint(auth_routes, url_prefix="/auth")
app.register_blueprint(product_routes, url_prefix="/products")
app.register_blueprint(category_routes, url_prefix="/categories")
app.register_blueprint(cart_routes, url_prefix="/cart")
app.register_blueprint(order_routes, url_prefix="/orders")
app.register_blueprint(address_routes, url_prefix="/addresses")
app.register_blueprint(payment_routes, url_prefix="/payments")


if __name__ == "__main__":
    app.run(debug=True, port=8000, host="0.0.0.0")