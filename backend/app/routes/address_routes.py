from flask import Blueprint, request, jsonify, g
from app.services.address_service import add_address, get_addresses, delete_address, set_default_address, update_address
from app.core.auth_middleware import auth_required

address_routes = Blueprint("addresses", __name__)

@address_routes.route("/add", methods=["POST"])
@auth_required
def create_address():
    data = request.get_json()
    return jsonify(add_address(g.user_id, data))

@address_routes.route("", methods=["GET"])
@auth_required
def fetch_addresses():
    return jsonify(get_addresses(g.user_id))

@address_routes.route("/<address_id>", methods=["DELETE"])
@auth_required
def remove_address(address_id):
    return jsonify(delete_address(g.user_id, address_id))

@address_routes.route("/default/<address_id>", methods=["PUT"])
@auth_required
def make_default(address_id):
    return jsonify(set_default_address(g.user_id, address_id))

@address_routes.route("/<address_id>", methods=["PUT"])
@auth_required
def edit_address(address_id):
    data = request.get_json()
    return jsonify(update_address(g.user_id, address_id, data))