from flask import Blueprint, jsonify, request, g
from app.services.order_service import (
    place_order,
    get_orders,
    get_order_details,
    get_or_create_address
)
from app.core.auth_middleware import auth_required

order_routes = Blueprint("orders", __name__)


# Place Order
@order_routes.route("/place", methods=["POST"])
@order_routes.route("/place/", methods=["POST"], strict_slashes=False)
@auth_required
def create_order():
    data = request.get_json()
    address_id = data.get("address_id")
    delivery_address = data.get("delivery_address")

    if not address_id and delivery_address:
        address_id = get_or_create_address(g.user_id, delivery_address)

    if not address_id:
        return jsonify({"error": "address_id or delivery_address is required"}), 400

    result = place_order(g.user_id, address_id)

    if result.get("error"):
        return jsonify(result), 400

    return jsonify(result), 201


# Get Order History
@order_routes.route("/history", methods=["GET"])
@order_routes.route("/history/", methods=["GET"], strict_slashes=False)
@auth_required
def get_order_history():
    result = get_orders(g.user_id)
    return jsonify(result), 200


# Get Order Details
@order_routes.route("/<order_id>", methods=["GET"])
@order_routes.route("/<order_id>/", methods=["GET"], strict_slashes=False)
@auth_required
def order_details(order_id):
    result = get_order_details(g.user_id, order_id)

    if isinstance(result, dict) and result.get("error"):
        return jsonify(result), 404

    return jsonify(result), 200