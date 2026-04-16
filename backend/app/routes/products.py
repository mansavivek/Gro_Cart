from flask import Blueprint, jsonify, request
from app.services.product_service import (
    get_products,
    get_product,
    get_categories
)

product_routes = Blueprint("products", __name__)

# Get all products
@product_routes.route("", methods=["GET"])
@product_routes.route("/", methods=["GET"])  
def products():
    category_id = request.args.get("category_id")
    category = request.args.get("category")
    return jsonify(get_products(category_id=category_id, category=category))

# Get single product
@product_routes.route("/<product_id>", methods=["GET"])
@product_routes.route("/<product_id>/", methods=["GET"], strict_slashes=False)
def product(product_id):
    result = get_product(product_id)

    if not result:
        return jsonify({"error": "Product not found"}), 404

    return jsonify(result)

# Get Categories
@product_routes.route("/categories", methods=["GET"])
@product_routes.route("/categories/", methods=["GET"], strict_slashes=False)
def categories():
    return jsonify(get_categories())