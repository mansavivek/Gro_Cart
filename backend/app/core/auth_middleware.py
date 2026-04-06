from flask import request, jsonify, g
from app.utils.jwt_service import decode_token

def auth_required(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token missing"}), 401

        # remove "Bearer "
        if token.startswith("Bearer "):
            token = token.split(" ")[1]

        user_id = decode_token(token)

        if not user_id:
            return jsonify({"error": "Invalid or expired token"}), 401

        g.user_id = user_id
        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper