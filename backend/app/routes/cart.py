"""Cart routes: get, add, update, remove and clear items in the authenticated user's cart"""

from flask import Blueprint, request, jsonify, g
from app.services.cart_service import (
    get_cart,
    add_to_cart,
    update_cart_item,
    remove_cart_item,
    clear_cart
)
from app.core.auth_middleware import auth_required

cart_routes = Blueprint("cart", __name__)


@cart_routes.route("", methods=["GET"])
@cart_routes.route("/", methods=["GET"], strict_slashes=False)
@auth_required
def cart():
    result = get_cart(g.user_id)
    return jsonify(result), 200


@cart_routes.route("/add", methods=["POST"])
@cart_routes.route("/add/", methods=["POST"], strict_slashes=False)
@auth_required
def add():
    data = request.get_json()
    result = add_to_cart(g.user_id, data)
    return jsonify(result), 200


@cart_routes.route("/update/<item_id>", methods=["PUT"])
@cart_routes.route("/update/<item_id>/", methods=["PUT"], strict_slashes=False)
@auth_required
def update(item_id):
    data = request.get_json()
    result = update_cart_item(g.user_id, item_id, data)
    return jsonify(result), 200


@cart_routes.route("/remove/<item_id>", methods=["DELETE"])
@cart_routes.route("/remove/<item_id>/", methods=["DELETE"], strict_slashes=False)
@auth_required
def remove(item_id):
    result = remove_cart_item(g.user_id, item_id)
    return jsonify(result), 200


@cart_routes.route("/clear", methods=["DELETE"])
@cart_routes.route("/clear/", methods=["DELETE"], strict_slashes=False)
@auth_required
def clear():
    result = clear_cart(g.user_id)
    return jsonify(result), 200