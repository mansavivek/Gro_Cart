"""Flask route decorators for JWT authentication and role-based access control"""

from functools import wraps
from flask import request, jsonify, g
from app.utils.jwt_service import decode_token

def auth_required(f):
    """Decode the Bearer JWT and attach user_id, email and role to Flask's g; returns 401 on failure"""
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Token missing"}), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Invalid authorization format"}), 401

        token = auth_header.split(" ")[1]
        payload = decode_token(token)

        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        g.user_id = payload["user_id"]
        g.user_email = payload.get("email")
        g.user_role = payload.get("role")

        return f(*args, **kwargs)

    return wrapper


def role_required(*allowed_roles):
    """Allow access only if g.user_role matches one of the allowed roles; returns 403 otherwise"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not hasattr(g, "user_role"):
                return jsonify({"error": "Unauthorized"}), 401

            if g.user_role not in allowed_roles:
                return jsonify({"error": "Forbidden"}), 403

            return f(*args, **kwargs)
        return wrapper
    return decorator