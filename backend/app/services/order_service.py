from app.database.connection import get_db
import json


def place_order(user_id, address_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # get cart
    cursor.execute("""
        SELECT ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.sku
        WHERE ci.user_id = %s
    """, (user_id,))

    items = cursor.fetchall()

    if not items:
        cursor.close()
        conn.close()
        return {"error": "Cart is empty"}

    # optional safety check: address must belong to this user
    cursor.execute("""
        SELECT id FROM addresses
        WHERE id = %s AND user_id = %s
    """, (address_id, user_id))

    address = cursor.fetchone()
    if not address:
        cursor.close()
        conn.close()
        return {"error": "Invalid address"}

    total_price = sum(i["quantity"] * float(i["price"]) for i in items)

    # create order WITH address
    cursor.execute("""
        INSERT INTO orders (user_id, total_price, address_id)
        VALUES (%s, %s, %s)
    """, (user_id, total_price, address_id))

    order_id = cursor.lastrowid

    # insert items
    for item in items:
        cursor.execute("""
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (%s, %s, %s, %s)
        """, (
            order_id,
            item["product_id"],
            item["quantity"],
            float(item["price"])
        ))

    # clear cart
    cursor.execute("DELETE FROM cart_items WHERE user_id = %s", (user_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "message": "Order placed successfully",
        "order_id": order_id,
        "total_price": total_price
    }


def get_orders(user_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            o.id,
            o.total_price,
            o.status,
            o.created_at,
            o.address_id,
            a.full_name,
            a.address_line1,
            a.address_line2,
            a.city,
            a.state,
            a.zip,
            a.phone
        FROM orders o
        LEFT JOIN addresses a ON o.address_id = a.id
        WHERE o.user_id = %s
        ORDER BY o.created_at DESC
    """, (user_id,))

    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return orders


def get_order_details(user_id, order_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # first confirm this order belongs to the logged-in user
    cursor.execute("""
        SELECT id
        FROM orders
        WHERE id = %s AND user_id = %s
    """, (order_id, user_id))

    order = cursor.fetchone()

    if not order:
        cursor.close()
        conn.close()
        return {"error": "Order not found"}

    cursor.execute("""
        SELECT 
            oi.id,
            oi.quantity,
            oi.price,
            p.name,
            p.images
        FROM order_items oi
        JOIN products p ON oi.product_id = p.sku
        WHERE oi.order_id = %s
    """, (order_id,))

    items = cursor.fetchall()

    formatted_items = []

    for item in items:
        try:
            imgs = json.loads(item["images"]) if item["images"] else []
            image_url = imgs[0] if imgs else None
        except Exception:
            image_url = None

        formatted_items.append({
            "id": item["id"],
            "quantity": item["quantity"],
            "price": float(item["price"]),
            "product": {
                "name": item["name"],
                "image_url": image_url
            }
        })

    cursor.close()
    conn.close()

    return formatted_items


def get_or_create_address(user_id, delivery_address):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Split string: "a, a, a, a, 1, 1"
    parts = [p.strip() for p in delivery_address.split(",")]

    address_line1 = parts[0] if len(parts) > 0 else ""
    address_line2 = parts[1] if len(parts) > 1 else ""
    city = parts[2] if len(parts) > 2 else ""
    state = parts[3] if len(parts) > 3 else ""
    zip_code = parts[4] if len(parts) > 4 else ""
    phone = parts[5] if len(parts) > 5 else ""

    # Try to find existing address (avoid duplicates)
    cursor.execute("""
        SELECT id
        FROM addresses
        WHERE user_id = %s
          AND address_line1 = %s
          AND address_line2 = %s
          AND city = %s
          AND state = %s
          AND zip = %s
          AND phone = %s
        LIMIT 1
    """, (user_id, address_line1, address_line2, city, state, zip_code, phone))

    row = cursor.fetchone()

    if row:
        cursor.close()
        conn.close()
        return row["id"]

    # Insert new address
    cursor.execute("""
        INSERT INTO addresses (
            user_id,
            address_line1,
            address_line2,
            city,
            state,
            zip,
            phone
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (user_id, address_line1, address_line2, city, state, zip_code, phone))

    conn.commit()
    address_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return address_id