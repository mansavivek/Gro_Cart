from flask import Blueprint, jsonify
from app.services.product_service import get_categories

category_routes = Blueprint("categories", __name__)

@category_routes.route("", methods=["GET"])
@category_routes.route("/", methods=["GET"], strict_slashes=False)
def categories():
    return jsonify(get_categories())