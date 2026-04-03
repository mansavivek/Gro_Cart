from flask import Blueprint, request, jsonify, g
from app.services.payment_service import save_payment_method, get_payment_methods
from app.core.auth_middleware import auth_required

payment_routes = Blueprint("payments", __name__)

@payment_routes.route("/add", methods=["POST"])
@auth_required
def add_payment():
    return jsonify(save_payment_method(g.user_id, request.json))

@payment_routes.route("", methods=["GET"])
@auth_required
def fetch_payments():
    return jsonify(get_payment_methods(g.user_id))

