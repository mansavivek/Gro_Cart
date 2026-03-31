from app.database.connection import get_db
import json

def place_order(user_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            ci.product_id,
            ci.quantity,
            p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.sku
        WHERE ci.user_id = %s
    """, (user_id,))

    items = cursor.fetchall()

    if not items:
        return {"error": "Cart is empty"}

    total_price = sum(i["quantity"] * float(i["price"]) for i in items)

    cursor.execute("""
        INSERT INTO orders (user_id, total_price)
        VALUES (%s, %s)
    """, (user_id, total_price))

    order_id = cursor.lastrowid

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

    cursor.execute("DELETE FROM cart_items WHERE user_id = %s", (user_id,))

    conn.commit()

    return {
        "message": "Order placed successfully",
        "order_id": order_id,
        "total_price": total_price
    }

def get_orders(user_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, total_price, status, created_at
        FROM orders
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id,))

    orders = cursor.fetchall()

    return {
        "orders": orders
    }


def get_order_details(order_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

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
        except:
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
    return formatted_items