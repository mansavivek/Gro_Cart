"""Payment routes: save a new card and list stored payment methods for the logged-in user."""

from flask import Blueprint, request, jsonify, g
from app.services.payment_service import save_payment_method, get_payment_methods
from app.core.auth_middleware import auth_required

payment_routes = Blueprint("payments", __name__)


@payment_routes.route("/add", methods=["POST"])
@payment_routes.route("/add/", methods=["POST"], strict_slashes=False)
@auth_required
def add_payment():
    data = request.get_json()
    result = save_payment_method(g.user_id, data)
    return jsonify(result), 200


@payment_routes.route("", methods=["GET"])
@payment_routes.route("/", methods=["GET"], strict_slashes=False)
@auth_required
def fetch_payments():
    result = get_payment_methods(g.user_id)
    return jsonify(result), 200