from app.database.connection import get_db

# Add to cart
def add_to_cart(user_id, data):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    product_id = data["product_id"]
    quantity = data.get("quantity", 1)

    cursor.execute("""
        SELECT * FROM cart_items 
        WHERE user_id = %s AND product_id = %s
    """, (user_id, product_id))

    item = cursor.fetchone()

    if item:
        cursor.execute("""
            UPDATE cart_items 
            SET quantity = quantity + %s
            WHERE id = %s
        """, (quantity, item["id"]))
    else:
        cursor.execute("""
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES (%s, %s, %s)
        """, (user_id, product_id, quantity))

    conn.commit()
    return {"message": "Added to cart"}

# Get cart
def get_cart(user_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            ci.id,
            ci.product_id,
            ci.quantity,
            p.name,
            p.price,
            p.images
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.sku
        WHERE ci.user_id = %s
    """, (user_id,))

    items = cursor.fetchall()

    import json

    formatted_items = []

    for item in items:
        try:
            if isinstance(item["images"], str):
                imgs = json.loads(item["images"])
            else:
                imgs = item["images"]

            image_url = imgs[0] if imgs else None
        except:
            image_url = None

        product = {
            "name": item["name"],
            "price": float(item["price"]) if item.get("price") else 0,
            "image_url": image_url
        }

        formatted_items.append({
            "id": item["id"],
            "product_id": item["product_id"],
            "quantity": item["quantity"],
            "product": product
        })

    total_items = sum(i["quantity"] for i in formatted_items)
    total_price = sum(i["quantity"] * i["product"]["price"] for i in formatted_items)

    return {
        "items": formatted_items,
        "total_items": total_items,
        "total_price": total_price
    }

# Update cart
def update_cart_item(user_id, item_id, data):
    conn = get_db()
    cursor = conn.cursor()

    quantity = data["quantity"]

    cursor.execute("""
        UPDATE cart_items 
        SET quantity = %s
        WHERE id = %s AND user_id = %s
    """, (quantity, item_id, user_id))

    conn.commit()
    return {"message": "Updated"}

# Remove cart
def remove_cart_item(user_id, item_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM cart_items 
        WHERE id = %s AND user_id = %s
    """, (item_id, user_id))

    conn.commit()
    return {"message": "Removed"}

# Clear cart
def clear_cart(user_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM cart_items WHERE user_id = %s", (user_id,))
    conn.commit()

    return {"message": "Cart cleared"}