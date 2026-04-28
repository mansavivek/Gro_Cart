"""User authentication service: registration, login, OTP-based password reset"""

import bcrypt
import random
from datetime import datetime, timedelta
from app.utils.email_service import send_otp_email
from app.database.connection import get_db
from app.utils.jwt_service import generate_token


def register_user(data):
    """Create a new customer account with a bcrypt-hashed password"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return {"error": "Name, email, and password are required"}, 400

    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        return {"error": "Email already exists"}, 409

    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, %s)",
            (name, email, hashed_pw, "customer")
        )
        conn.commit()
        return {"message": "User registered successfully"}, 201
    except Exception as e:
        return {"error": str(e)}, 500


def login_user(data):
    """Verify credentials and return a JWT token on success"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (data["email"],))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}, 404

    if not bcrypt.checkpw(
        data["password"].encode(),
        user["password_hash"].encode()
    ):
        return {"error": "Invalid password"}, 401

    token = generate_token(user)

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "user_id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }, 200


def forgot_password(email):
    """Generate and email a 6-digit OTP valid for 10 minutes"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        return {"error": "Email not registered"}, 404

    otp = str(random.randint(100000, 999999))
    expires_at = datetime.now() + timedelta(minutes=10)

    sent = send_otp_email(email, otp)
    if not sent:
        return {"error": "Unable to send OTP"}, 500

    cursor.execute("""
        INSERT INTO password_resets (email, otp, expires_at)
        VALUES (%s, %s, %s)
    """, (email, otp, expires_at))

    conn.commit()

    return {"message": "OTP sent successfully"}, 200   

def verify_otp(email, otp):
    """Check the OTP against the latest password_resets record; reject if expired"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM password_resets
        WHERE email=%s AND otp=%s
        ORDER BY created_at DESC LIMIT 1
    """, (email, otp))

    record = cursor.fetchone()

    if not record:
        return {"error": "Invalid OTP"}, 400

    if datetime.now() > record["expires_at"]:
        return {"error": "OTP expired"}, 400

    return {"message": "OTP verified"}, 200   

def reset_password(email, new_password):
    """Hash and store the new password, then purge all OTP records for that email"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}, 404

    hashed_pw = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt())

    cursor.execute("""
        UPDATE users
        SET password_hash=%s
        WHERE email=%s
    """, (hashed_pw.decode(), email))

    cursor.execute("DELETE FROM password_resets WHERE email=%s", (email,))

    conn.commit()

    return {"message": "Password updated successfully"}, 200  


def get_user_by_id(user_id):
    """Return id, name, email, and role for the given user or None if not found"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, name, email, role FROM users WHERE id = %s", (user_id,))
    return cursor.fetchone()     