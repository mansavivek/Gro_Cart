from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user

auth_routes = Blueprint("auth", __name__)

# REGISTER
@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    return jsonify(register_user(data))


# LOGIN
@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    return jsonify(login_user(data))  