from app.database.connection import get_db
import json


def get_primary_category_name(breadcrumbs):
    if not breadcrumbs:
        return None
    return str(breadcrumbs).split(">")[0].strip()


def normalize_stock_fields(product):
    availability = str(product.get("availability") or "").strip().lower()
    is_available = availability in {"instock", "in stock", "available", "true", "1"}

    quantity = product.get("quantity")
    if quantity is None:
        quantity = 25 if is_available else 0
    else:
        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            quantity = 25 if is_available else 0

    product["quantity"] = max(0, quantity)
    product["in_stock"] = product["quantity"] > 0
    return product

def transform_product(p):

    p["id"] = p.get("sku")
    images = []

    if p.get("images"):
        try:
            raw = json.loads(p["images"])

            if isinstance(raw, list):
                for item in raw:
                    if isinstance(item, str):
                        if "~" in item:
                            images.extend(item.split("~"))
                        else:
                            images.append(item)
        except:
            images = []

    images = [img.strip() for img in images if img and img.startswith("http")]

    p["images"] = images

    p["image_url"] = images[0] if images else "https://via.placeholder.com/300"

    p["category_name"] = get_primary_category_name(p.get("breadcrumbs"))
    normalize_stock_fields(p)

    return p


# Get products
def get_products(category_id=None, category=None):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    transformed = [transform_product(p) for p in products]

    if category is not None:
        category_name = str(category).strip().lower()
        return [p for p in transformed if str(p.get("category_name") or "").lower() == category_name]

    if category_id is not None:
        try:
            category_id = int(category_id)
        except (TypeError, ValueError):
            return []

        categories = get_categories()
        selected = next((c for c in categories if c.get("id") == category_id), None)
        if not selected:
            return []

        selected_name = str(selected.get("name") or "").strip().lower()
        return [p for p in transformed if str(p.get("category_name") or "").lower() == selected_name]

    return transformed


# Get single product
def get_product(product_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products WHERE sku = %s", (product_id,))
    p = cursor.fetchone()

    if p:
        return transform_product(p)

    return None


# Get categories
def get_categories():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT DISTINCT breadcrumbs FROM products")
    rows = cursor.fetchall()

    categories = []
    seen = set()

    for r in rows:
        breadcrumb = r.get("breadcrumbs", "")
        if breadcrumb:
            cat = breadcrumb.split(">")[0].strip()
            if cat not in seen:
                seen.add(cat)
                categories.append({"id": len(categories) + 1, "name": cat})

    return categories


# Create product
def create_product(data):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO products (
            sku, name, price, currency, availability,
            description, brand, breadcrumbs, images
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data["sku"],  
        data["name"],
        data["price"],
        "USD",
        data.get("availability", "InStock"),
        data.get("description"),
        data.get("brand"),
        data.get("breadcrumbs"),
        json.dumps(data.get("images", []))
    ))

    conn.commit()
    return {"message": "Product created"}


# Update product
def update_product(product_id, data):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE products 
        SET name=%s, price=%s, description=%s
        WHERE sku=%s
    """, (
        data["name"],
        data["price"],
        data.get("description"),
        product_id
    ))

    conn.commit()
    return {"message": "Product updated"}


# Delete product
def delete_product(product_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM products WHERE sku=%s", (product_id,))
    conn.commit()

    return {"message": "Product deleted"}