"""Payment service: save and retrieve stored card details for a user"""

from app.database.connection import get_db


def save_payment_method(user_id, data):
    """Store a payment method, persisting only the last 4 digits of the card number"""
    conn = get_db()
    cursor = conn.cursor()

    last4 = data["card_number"][-4:]

    cursor.execute("""
        INSERT INTO payment_methods
        (user_id, card_holder_name, card_brand, last4, expiry)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        user_id,
        data["card_holder_name"],
        data["card_brand"],
        last4,
        data["expiry"]
    ))

    conn.commit()

    return {"message": "Saved successfully"}

def get_payment_methods(user_id):
    """Return all saved payment methods for a user, default card first"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, card_holder_name, card_brand, last4, expiry, is_default
        FROM payment_methods
        WHERE user_id = %s
        ORDER BY is_default DESC
    """, (user_id,))

    return cursor.fetchall()    
  