from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user, forgot_password, verify_otp, reset_password

auth_routes = Blueprint("auth", __name__)

# REGISTER
@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    response, status_code = register_user(data)
    return jsonify(response), status_code

# LOGIN
@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    return jsonify(login_user(data))  

# SEND OTP
@auth_routes.route("/forgot-password", methods=["POST"])
def forgot():
    data = request.json
    return jsonify(forgot_password(data["email"]))


# VERIFY OTP
@auth_routes.route("/verify-otp", methods=["POST"])
def verify():
    data = request.json
    return jsonify(verify_otp(data["email"], data["otp"]))


# RESET PASSWORD
@auth_routes.route("/reset-password", methods=["POST"])
def reset():
    data = request.json
    return jsonify(reset_password(data["email"], data["new_password"]))    