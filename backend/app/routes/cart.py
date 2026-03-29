from flask import Blueprint, request, jsonify
from app.services.cart_service import *

cart_routes = Blueprint("cart", __name__)

def get_user_id():
    return 1 

@cart_routes.route("", methods=["GET"])
def cart():
    user_id = get_user_id()
    return jsonify(get_cart(user_id))


@cart_routes.route("/add", methods=["POST"])
def add():
    user_id = get_user_id()
    data = request.json
    return jsonify(add_to_cart(user_id, data))


@cart_routes.route("/update/<item_id>", methods=["PUT"])
def update(item_id):
    user_id = get_user_id()
    data = request.json
    return jsonify(update_cart_item(user_id, item_id, data))


@cart_routes.route("/remove/<item_id>", methods=["DELETE"])
def remove(item_id):
    user_id = get_user_id()
    return jsonify(remove_cart_item(user_id, item_id))


@cart_routes.route("/clear", methods=["DELETE"])
def clear():
    user_id = get_user_id()
    return jsonify(clear_cart(user_id))