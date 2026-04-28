"""Address service: manage saved delivery addresses for a user"""

from app.database.connection import get_db


def add_address(user_id, data):
    """Insert a new delivery address for the user"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO addresses 
        (user_id, label, full_name, address_line1, address_line2, city, state, zip, phone)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        user_id,
        data.get("label"),
        data.get("full_name"),
        data.get("address_line1"),
        data.get("address_line2"),
        data.get("city"),
        data.get("state"),
        data.get("zip"),
        data.get("phone")
    ))

    conn.commit()

    return {
        "message": "Address saved successfully"
    }

def get_addresses(user_id):
    """Return all addresses for a user, default address first"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM addresses
        WHERE user_id = %s
        ORDER BY is_default DESC, created_at DESC
    """, (user_id,))

    return cursor.fetchall()    

def delete_address(user_id, address_id):
    """Delete an address owned by the user"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM addresses
        WHERE id = %s AND user_id = %s
    """, (address_id, user_id))

    conn.commit()

    return {"message": "Address deleted"}

def set_default_address(user_id, address_id):
    """Mark one address as default"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE addresses
        SET is_default = FALSE
        WHERE user_id = %s
    """, (user_id,))

    cursor.execute("""
        UPDATE addresses
        SET is_default = TRUE
        WHERE id = %s AND user_id = %s
    """, (address_id, user_id))

    conn.commit()

    return {"message": "Default address updated"}    

def update_address(user_id, address_id, data):
    """Update all fields of an existing address owned by the user"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE addresses
        SET 
            label = %s,
            full_name = %s,
            address_line1 = %s,
            address_line2 = %s,
            city = %s,
            state = %s,
            zip = %s,
            phone = %s
        WHERE id = %s AND user_id = %s
    """, (
        data["label"],
        data["full_name"],
        data["address_line1"],
        data.get("address_line2"),
        data["city"],
        data["state"],
        data["zip"],
        data["phone"],
        address_id,
        user_id
    ))

    conn.commit()

    return {"message": "Address updated successfully"}    