from app.database.connection import get_db
import bcrypt

# Register
def register_user(data):
    conn = get_db()
    cursor = conn.cursor()

    hashed_pw = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

    try:
        cursor.execute(
            "INSERT INTO Users (name, email, password_hash) VALUES (%s, %s, %s)",
            (data["name"], data["email"], hashed_pw.decode())
        )
        conn.commit()
        return {"message": "User registered successfully"}
    except Exception as e:
        return {"error": str(e)}


# Login
def login_user(data):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Users WHERE email=%s", (data["email"],))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}

    if bcrypt.checkpw(data["password"].encode(), user["password_hash"].encode()):
        return {
            "message": "Login successful",
            "user": {
                "user_id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }

    return {"error": "Invalid password"}