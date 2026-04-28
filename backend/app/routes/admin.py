"""Admin routes: order status management and full product CRUD, restricted to admin role"""

from flask import Blueprint, jsonify, request
from app.services.admin_service import (
    get_admin_orders,
    update_admin_order_status,
    create_admin_product,
    update_admin_product,
    delete_admin_product,
)
from app.core.auth_middleware import auth_required, role_required

admin_routes = Blueprint("admin_routes", __name__, url_prefix="/admin")


@admin_routes.route("/orders", methods=["GET"])
@admin_routes.route("/orders/", methods=["GET"], strict_slashes=False)
@auth_required
@role_required("admin")
def admin_get_orders():
    result = get_admin_orders()
    return jsonify(result["orders"]), 200


@admin_routes.route("/orders/<int:order_id>/status", methods=["PUT"])
@admin_routes.route("/orders/<int:order_id>/status/", methods=["PUT"], strict_slashes=False)
@auth_required
@role_required("admin")
def admin_update_order_status(order_id):
    data = request.get_json() or {}
    status = data.get("status")

    if not status:
        return jsonify({"error": "status is required"}), 400

    result = update_admin_order_status(order_id, status)
    if not result:
        return jsonify({"error": "Order not found"}), 404

    return jsonify(result), 200


@admin_routes.route("/products", methods=["POST"])
@admin_routes.route("/products/", methods=["POST"], strict_slashes=False)
@auth_required
@role_required("admin")
def admin_create_product():
    data = request.get_json() or {}

    required_fields = ["name", "price"]
    missing = [field for field in required_fields if data.get(field) in (None, "")]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    result = create_admin_product(data)
    return jsonify(result), 201


@admin_routes.route("/products/<string:sku>", methods=["PUT"])
@admin_routes.route("/products/<string:sku>/", methods=["PUT"], strict_slashes=False)
@auth_required
@role_required("admin")
def admin_update_product(sku):
    data = request.get_json() or {}
    result = update_admin_product(sku, data)

    if not result:
        return jsonify({"error": "Product not found"}), 404

    return jsonify(result), 200


@admin_routes.route("/products/<string:sku>", methods=["DELETE"])
@admin_routes.route("/products/<string:sku>/", methods=["DELETE"], strict_slashes=False)
@auth_required
@role_required("admin")
def admin_delete_product(sku):
    deleted = delete_admin_product(sku)

    if not deleted:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"message": "Product deleted successfully"}), 200