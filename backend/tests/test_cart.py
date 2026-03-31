def _create_product(client, admin_headers, name="Milk", price=1.5, quantity=100):
    resp = client.post(
        "/admin/products",
        json={"name": name, "price": price, "quantity": quantity},
        headers=admin_headers,
    )
    assert resp.status_code == 201
    return resp.json()["id"]


def test_view_empty_cart(client, auth_headers):
    resp = client.get("/cart", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_items"] == 0
    assert data["total_price"] == 0.0


def test_add_to_cart(client, auth_headers, admin_headers):
    prod_id = _create_product(client, admin_headers)

    resp = client.post(
        "/cart/add",
        json={"product_id": prod_id, "quantity": 2},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    assert resp.json()["quantity"] == 2


def test_add_nonexistent_product(client, auth_headers):
    resp = client.post(
        "/cart/add",
        json={"product_id": 9999, "quantity": 1},
        headers=auth_headers,
    )
    assert resp.status_code == 404


def test_update_cart_item(client, auth_headers, admin_headers):
    prod_id = _create_product(client, admin_headers, name="Eggs")
    add_resp = client.post(
        "/cart/add",
        json={"product_id": prod_id, "quantity": 1},
        headers=auth_headers,
    )
    item_id = add_resp.json()["id"]

    update_resp = client.put(
        f"/cart/update/{item_id}",
        json={"quantity": 3},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["quantity"] == 3


def test_remove_cart_item(client, auth_headers, admin_headers):
    prod_id = _create_product(client, admin_headers, name="Bread")
    add_resp = client.post(
        "/cart/add",
        json={"product_id": prod_id, "quantity": 1},
        headers=auth_headers,
    )
    item_id = add_resp.json()["id"]

    del_resp = client.delete(f"/cart/remove/{item_id}", headers=auth_headers)
    assert del_resp.status_code == 204

    cart = client.get("/cart", headers=auth_headers).json()
    assert cart["total_items"] == 0


def test_clear_cart(client, auth_headers, admin_headers):
    prod_id = _create_product(client, admin_headers, name="Juice")
    client.post("/cart/add", json={"product_id": prod_id, "quantity": 2}, headers=auth_headers)
    client.delete("/cart/clear", headers=auth_headers)
    cart = client.get("/cart", headers=auth_headers).json()
    assert cart["total_items"] == 0


def test_cart_requires_auth(client):
    resp = client.get("/cart")
    assert resp.status_code == 401
