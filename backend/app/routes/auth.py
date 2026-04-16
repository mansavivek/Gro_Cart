from flask import Blueprint, request, jsonify, g
from app.services.auth_service import (
    register_user,
    login_user,
    forgot_password,
    verify_otp,
    reset_password,
    get_user_by_id
)
from app.core.auth_middleware import auth_required

auth_routes = Blueprint("auth", __name__)

# REGISTER
@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    result, status = register_user(data)
    return jsonify(result), status


# LOGIN
@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    result, status = login_user(data)
    return jsonify(result), status


# SEND OTP
@auth_routes.route("/forgot-password", methods=["POST"])
def forgot():
    data = request.get_json()

    if not data or "email" not in data:
        return jsonify({"error": "Email is required"}), 400

    result, status = forgot_password(data["email"])
    return jsonify(result), status


# VERIFY OTP
@auth_routes.route("/verify-otp", methods=["POST"])
def verify():
    data = request.get_json()

    if not data or "email" not in data or "otp" not in data:
        return jsonify({"error": "Email and OTP are required"}), 400

    result, status = verify_otp(data["email"], data["otp"])
    return jsonify(result), status


# RESET PASSWORD
@auth_routes.route("/reset-password", methods=["POST"])
def reset():
    data = request.get_json()

    if not data or "email" not in data or "new_password" not in data:
        return jsonify({"error": "Email and new password are required"}), 400

    result, status = reset_password(data["email"], data["new_password"])
    return jsonify(result), status


# CURRENT LOGGED-IN USER
@auth_routes.route("/me", methods=["GET"])
@auth_required
def me():
    user = get_user_by_id(g.user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": {
            "user_id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200