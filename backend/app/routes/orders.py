from flask import Blueprint, jsonify, request, g
from app.services.order_service import place_order, get_orders, get_order_details, get_or_create_address

order_routes = Blueprint("orders", __name__)

# Place Order
@order_routes.route("/place", methods=["POST"])
def create_order():
    user_id = 1
    data = request.json
    address_id = data.get("address_id") 
    delivery_address = data.get("delivery_address")

    if not address_id and delivery_address:
        address_id = get_or_create_address(user_id, delivery_address)

    if not address_id:
        return jsonify({"error": "address_id or delivery_address is required"}), 400

    return jsonify(place_order(user_id, address_id)), 201


# Get Order History
@order_routes.route("/history", methods=["GET"])
def get_order_history():
    user_id = 1
    return jsonify(get_orders(user_id))


# Get Order Details
@order_routes.route("/<order_id>", methods=["GET"])
def order_details(order_id):
    return jsonify(get_order_details(order_id))