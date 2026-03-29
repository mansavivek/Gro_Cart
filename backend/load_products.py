import pandas as pd
import mysql.connector
import json
import re

file_path = "groceries_dataset.xlsx"
df = pd.read_excel(file_path)

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Welcome*2025",
    database="gro_cart"
)

cursor = conn.cursor()

def clean_value(val):
    if pd.isna(val):
        return None
    return val

def clean_float(val):
    if pd.isna(val):
        return 0
    try:
        return float(val)
    except:
        return 0

def clean_percentage(val):
    if pd.isna(val):
        return 0
    try:
        # extract number from "28% vol"
        num = re.findall(r"\d+\.?\d*", str(val))
        return float(num[0]) if num else 0
    except:
        return 0

for _, row in df.iterrows():
    try:
        cursor.execute("""
            INSERT INTO products (
                sku, name, price, currency, availability,
                description, brand, breadcrumbs, images,
                avg_rating, reviews_count, pack_size,
                ingredients, storage_details,
                percentage_alcohol, serving_size, nutrition
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            str(row.get("sku")),
            clean_value(row.get("name")),
            clean_float(row.get("price")),
            "USD",
            clean_value(row.get("availability")) or "InStock",
            clean_value(row.get("description")),
            clean_value(row.get("brand")),
            clean_value(row.get("breadcrumbs")),
            json.dumps([clean_value(row.get("images"))]) if not pd.isna(row.get("images")) else "[]",
            clean_float(row.get("avg_rating")),
            int(row.get("reviews_count")) if not pd.isna(row.get("reviews_count")) else 0,
            clean_value(row.get("pack_size")),
            clean_value(row.get("ingredients")),
            clean_value(row.get("storage_details")),
            clean_percentage(row.get("percentage_alcohol")),
            clean_value(row.get("serving_size")),
            clean_value(row.get("nutrition"))
        ))

    except Exception as e:
        print("Error inserting row:", e)

conn.commit()
print("Clean data inserted successfully!")