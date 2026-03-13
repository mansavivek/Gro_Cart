def test_list_products_empty(client):
    resp = client.get("/products")
    assert resp.status_code == 200
    assert resp.json() == []


def test_list_categories_empty(client):
    resp = client.get("/categories")
    assert resp.status_code == 200
    assert resp.json() == []


def test_admin_create_and_list_products(client, admin_headers):
    # Create category first
    cat_resp = client.post(
        "/admin/categories",
        json={"name": "Vegetables", "description": "Fresh vegs"},
        headers=admin_headers,
    )
    assert cat_resp.status_code == 201
    cat_id = cat_resp.json()["id"]

    # Create product
    prod_resp = client.post(
        "/admin/products",
        json={
            "name": "Carrot",
            "description": "Fresh orange carrot",
            "price": 1.99,
            "quantity": 100,
            "category_id": cat_id,
        },
        headers=admin_headers,
    )
    assert prod_resp.status_code == 201
    prod = prod_resp.json()
    assert prod["name"] == "Carrot"
    assert prod["price"] == 1.99

    # List products
    list_resp = client.get("/products")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 1


def test_get_product_not_found(client):
    resp = client.get("/products/999")
    assert resp.status_code == 404


def test_admin_update_product(client, admin_headers):
    prod_resp = client.post(
        "/admin/products",
        json={"name": "Apple", "price": 2.0, "quantity": 50},
        headers=admin_headers,
    )
    prod_id = prod_resp.json()["id"]

    update_resp = client.put(
        f"/admin/products/{prod_id}",
        json={"price": 2.5, "quantity": 45},
        headers=admin_headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["price"] == 2.5


def test_admin_delete_product(client, admin_headers):
    prod_resp = client.post(
        "/admin/products",
        json={"name": "Banana", "price": 0.5, "quantity": 200},
        headers=admin_headers,
    )
    prod_id = prod_resp.json()["id"]

    del_resp = client.delete(f"/admin/products/{prod_id}", headers=admin_headers)
    assert del_resp.status_code == 204

    get_resp = client.get(f"/products/{prod_id}")
    assert get_resp.status_code == 404


def test_non_admin_cannot_create_product(client, auth_headers):
    resp = client.post(
        "/admin/products",
        json={"name": "Mango", "price": 3.0, "quantity": 10},
        headers=auth_headers,
    )
    assert resp.status_code == 403
