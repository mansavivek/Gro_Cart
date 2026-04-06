from app.database.connection import get_db

# SAVE PAYMENT METHOD
def save_payment_method(user_id, data):
    conn = get_db()
    cursor = conn.cursor()

    # only store last 4 digits
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

#Get payment
def get_payment_methods(user_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, card_holder_name, card_brand, last4, expiry, is_default
        FROM payment_methods
        WHERE user_id = %s
        ORDER BY is_default DESC
    """, (user_id,))

    return cursor.fetchall()    

# #Set default payment
# def set_default_payment(user_id, payment_id):
#     conn = get_db()
#     cursor = conn.cursor()

#     cursor.execute("UPDATE payment_methods SET is_default = FALSE WHERE user_id=%s", (user_id,))
#     cursor.execute("""
#         UPDATE payment_methods
#         SET is_default = TRUE
#         WHERE id=%s AND user_id=%s
#     """, (payment_id, user_id))

#     conn.commit()

#     return {"message": "Default payment set"}    