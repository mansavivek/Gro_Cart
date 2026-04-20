import json
import random
from app.database.connection import get_db


def _format_delivery_address(row):
    parts = [
        row.get("address_line1"),
        row.get("address_line2"),
        row.get("city"),
        row.get("state"),
        row.get("zip"),
    ]
    return ", ".join([str(p).strip() for p in parts if p])


def get_admin_orders():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            o.id,
            o.user_id,
            o.status,
            o.created_at,
            o.total_price,
            u.name AS customer_name,
            u.email AS customer_email,
            a.address_line1,
            a.address_line2,
            a.city,
            a.state,
            a.zip
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN addresses a ON o.address_id = a.id
        ORDER BY o.created_at DESC
    """)
    order_rows = cursor.fetchall()

    orders = []
    for row in order_rows:
        order_id = row["id"]

        cursor.execute("""
            SELECT
                oi.product_id,
                oi.quantity,
                oi.price,
                p.name
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.sku
            WHERE oi.order_id = %s
        """, (order_id,))
        item_rows = cursor.fetchall()

        items = []
        for item in item_rows:
            items.append({
                "product_id": item["product_id"],
                "name": item.get("name"),
                "quantity": item["quantity"],
                "price": float(item["price"]) if item["price"] is not None else 0,
            })

        orders.append({
            "id": row["id"],
            "user_id": row["user_id"],
            "user": {
                "id": row["user_id"],
                "name": row.get("customer_name") or "Customer",
                "email": row.get("customer_email"),
            },
            "customer_name": row.get("customer_name") or "Customer",
            "customer_email": row.get("customer_email"),
            "status": row["status"],
            "created_at": row["created_at"],
            "total_amount": float(row["total_price"]) if row["total_price"] is not None else 0,
            "items": items,
            "items_count": len(items),
            "delivery_address": _format_delivery_address(row),
        })

    cursor.close()
    conn.close()
    return {"orders": orders}


def update_admin_order_status(order_id, status):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM orders WHERE id = %s", (order_id,))
    exists = cursor.fetchone()
    if not exists:
        cursor.close()
        conn.close()
        return None

    cursor.execute("""
        UPDATE orders
        SET status = %s
        WHERE id = %s
    """, (status, order_id))
    conn.commit()

    cursor.execute("""
        SELECT
            o.id,
            o.user_id,
            o.status,
            o.created_at,
            o.total_price,
            u.name AS customer_name,
            u.email AS customer_email,
            a.address_line1,
            a.address_line2,
            a.city,
            a.state,
            a.zip
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN addresses a ON o.address_id = a.id
        WHERE o.id = %s
    """, (order_id,))
    row = cursor.fetchone()

    cursor.execute("""
        SELECT
            oi.product_id,
            oi.quantity,
            oi.price,
            p.name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.sku
        WHERE oi.order_id = %s
    """, (order_id,))
    item_rows = cursor.fetchall()

    items = []
    for item in item_rows:
        items.append({
            "product_id": item["product_id"],
            "name": item.get("name"),
            "quantity": item["quantity"],
            "price": float(item["price"]) if item["price"] is not None else 0,
        })

    result = {
        "id": row["id"],
        "user_id": row["user_id"],
        "user": {
            "id": row["user_id"],
            "name": row.get("customer_name") or "Customer",
            "email": row.get("customer_email"),
        },
        "customer_name": row.get("customer_name") or "Customer",
        "customer_email": row.get("customer_email"),
        "status": row["status"],
        "created_at": row["created_at"],
        "total_amount": float(row["total_price"]) if row["total_price"] is not None else 0,
        "items": items,
        "items_count": len(items),
        "delivery_address": _format_delivery_address(row),
    }

    cursor.close()
    conn.close()
    return result


def generate_unique_sku(cursor):
    while True:
        sku = str(random.randint(100000000, 999999999))
        cursor.execute("SELECT sku FROM products WHERE sku = %s", (sku,))
        exists = cursor.fetchone()
        if not exists:
            return sku


def create_admin_product(data):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    sku = data.get("sku")
    if not sku:
        sku = generate_unique_sku(cursor)

    name = data.get("name")
    price = data.get("price")
    description = data.get("description")
    brand = data.get("brand")
    images = data.get("images")
    if images is None:
        images = data.get("image_url")

    if isinstance(images, str):
        images = [images] if images.strip() else []
    elif images is None:
        images = []
    elif not isinstance(images, list):
        images = [images]

    category_id = data.get("category_id")
    breadcrumbs = data.get("breadcrumbs") or data.get("category")
    if not breadcrumbs and category_id:
        cursor.execute("SELECT name FROM categories WHERE id = %s", (category_id,))
        category_row = cursor.fetchone()
        if category_row:
            breadcrumbs = category_row.get("name")

    availability = data.get("availability", "InStock")
    currency = data.get("currency", "USD")
    pack_size = data.get("pack_size")
    ingredients = data.get("ingredients")
    storage_details = data.get("storage_details")
    percentage_alcohol = data.get("percentage_alcohol")
    serving_size = data.get("serving_size")
    nutrition = data.get("nutrition")
    quantity = data.get("quantity", 0)

    images = json.dumps(images)

    if isinstance(nutrition, (list, dict)):
        nutrition = json.dumps(nutrition)

    cursor.execute("""
        INSERT INTO products (
            sku, name, price, currency, availability, description, brand,
            breadcrumbs, images, pack_size, ingredients, storage_details,
            percentage_alcohol, serving_size, nutrition, quantity
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        sku, name, price, currency, availability, description, brand,
        breadcrumbs, images, pack_size, ingredients, storage_details,
        percentage_alcohol, serving_size, nutrition, quantity
    ))
    conn.commit()

    cursor.execute("""
        SELECT
            sku,
            name,
            price,
            currency,
            availability,
            description,
            brand,
            breadcrumbs,
            images,
            pack_size,
            ingredients,
            storage_details,
            percentage_alcohol,
            serving_size,
            nutrition,
            quantity,
            created_at
        FROM products
        WHERE sku = %s
    """, (sku,))
    product = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "id": product["sku"],
        "sku": product["sku"],
        "name": product["name"],
        "price": float(product["price"]) if product["price"] is not None else 0,
        "currency": product.get("currency"),
        "availability": product.get("availability"),
        "description": product.get("description"),
        "brand": product.get("brand"),
        "breadcrumbs": product.get("breadcrumbs"),
        "images": json.loads(product["images"]) if product.get("images") else [],
        "pack_size": product.get("pack_size"),
        "ingredients": product.get("ingredients"),
        "storage_details": product.get("storage_details"),
        "percentage_alcohol": product.get("percentage_alcohol"),
        "serving_size": product.get("serving_size"),
        "nutrition": product.get("nutrition"),
        "created_at": product.get("created_at"),
        "stock": product.get("quantity", 0)
    }


def update_admin_product(sku, data):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT sku FROM products WHERE sku = %s", (sku,))
    exists = cursor.fetchone()
    if not exists:
        cursor.close()
        conn.close()
        return None

    category_id = data.get("category_id")
    breadcrumbs = data.get("breadcrumbs") or data.get("category")
    if not breadcrumbs and category_id:
        cursor.execute("SELECT name FROM categories WHERE id = %s", (category_id,))
        category_row = cursor.fetchone()
        if category_row:
            breadcrumbs = category_row.get("name")

    raw_images = data.get("images")
    if raw_images is None:
        raw_images = data.get("image")
    if raw_images is None:
        raw_images = data.get("image_url")

    if isinstance(raw_images, str):
        raw_images = json.dumps([raw_images] if raw_images.strip() else [])
    elif isinstance(raw_images, list):
        raw_images = json.dumps(raw_images)
    elif raw_images is not None:
        raw_images = json.dumps([raw_images])

    nutrition = data.get("nutrition")
    if isinstance(nutrition, (list, dict)):
        nutrition = json.dumps(nutrition)

    updatable_fields = {
        "name": data.get("name"),
        "price": data.get("price"),
        "currency": data.get("currency"),
        "availability": data.get("availability"),
        "description": data.get("description"),
        "brand": data.get("brand"),
        "breadcrumbs": breadcrumbs,
        "images": raw_images,
        "pack_size": data.get("pack_size"),
        "ingredients": data.get("ingredients"),
        "storage_details": data.get("storage_details"),
        "percentage_alcohol": data.get("percentage_alcohol"),
        "serving_size": data.get("serving_size"),
        "nutrition": nutrition,
        "quantity": data.get("quantity"),
    }

    set_clauses = []
    values = []

    for field, value in updatable_fields.items():
        if value is not None:
            set_clauses.append(f"{field} = %s")
            values.append(value)

    if set_clauses:
        values.append(sku)
        query = f"UPDATE products SET {', '.join(set_clauses)} WHERE sku = %s"
        cursor.execute(query, tuple(values))
        conn.commit()

    cursor.execute("""
        SELECT
            sku,
            name,
            price,
            currency,
            availability,
            description,
            brand,
            breadcrumbs,
            images,
            pack_size,
            ingredients,
            storage_details,
            percentage_alcohol,
            serving_size,
            nutrition,
            quantity,
            created_at
        FROM products
        WHERE sku = %s
    """, (sku,))
    product = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "id": product["sku"],
        "sku": product["sku"],
        "name": product["name"],
        "price": float(product["price"]) if product["price"] is not None else 0,
        "currency": product.get("currency"),
        "availability": product.get("availability"),
        "description": product.get("description"),
        "brand": product.get("brand"),
        "breadcrumbs": product.get("breadcrumbs"),
        "images": json.loads(product["images"]) if product.get("images") else [],
        "pack_size": product.get("pack_size"),
        "ingredients": product.get("ingredients"),
        "storage_details": product.get("storage_details"),
        "percentage_alcohol": product.get("percentage_alcohol"),
        "serving_size": product.get("serving_size"),
        "nutrition": product.get("nutrition"),
        "created_at": product.get("created_at"),
        "stock": data.get("quantity", 0)
    }


def delete_admin_product(sku):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT sku FROM products WHERE sku = %s", (sku,))
    exists = cursor.fetchone()
    if not exists:
        cursor.close()
        conn.close()
        return False

    cursor.execute("DELETE FROM products WHERE sku = %s", (sku,))
    conn.commit()

    cursor.close()
    conn.close()
    return True