from app.database.connection import get_db
import json

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

    return p


# Get products
def get_products():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    return [transform_product(p) for p in products]


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