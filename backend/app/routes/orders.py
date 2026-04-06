from flask import Blueprint, jsonify, request, g
from app.services.order_service import place_order, get_orders, get_order_details

order_routes = Blueprint("orders", __name__)

# Place Order
@order_routes.route("/place", methods=["POST"])
def create_order():
    user_id = 1
    data = request.json
    address_id = data.get("address_id")  
    return jsonify(place_order(user_id, address_id))


# Get Order History
@order_routes.route("/history", methods=["GET"])
def get_order_history():
    user_id = 1
    return jsonify(get_orders(user_id))


# Get Order Details
@order_routes.route("/<order_id>", methods=["GET"])
def order_details(order_id):
    return jsonify(get_order_details(order_id))