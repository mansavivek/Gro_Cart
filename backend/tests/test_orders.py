def _create_product(client, admin_headers, name="Rice", price=2.0, quantity=50):
    resp = client.post(
        "/admin/products",
        json={"name": name, "price": price, "quantity": quantity},
        headers=admin_headers,
    )
    return resp.json()["id"]


def _fill_cart(client, auth_headers, admin_headers):
    prod_id = _create_product(client, admin_headers)
    client.post(
        "/cart/add",
        json={"product_id": prod_id, "quantity": 3},
        headers=auth_headers,
    )


def test_place_order(client, auth_headers, admin_headers):
    _fill_cart(client, auth_headers, admin_headers)

    resp = client.post(
        "/orders/place",
        json={"delivery_address": "42 Oak Ave", "payment_method": "card"},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    order = resp.json()
    assert order["status"] == "pending"
    assert order["delivery_address"] == "42 Oak Ave"
    assert order["total_amount"] == 6.0
    assert len(order["items"]) == 1


def test_place_order_empty_cart(client, auth_headers):
    resp = client.post(
        "/orders/place",
        json={"delivery_address": "10 Elm St", "payment_method": "cash"},
        headers=auth_headers,
    )
    assert resp.status_code == 400


def test_order_history(client, auth_headers, admin_headers):
    _fill_cart(client, auth_headers, admin_headers)
    client.post(
        "/orders/place",
        json={"delivery_address": "1 Pine Rd", "payment_method": "card"},
        headers=auth_headers,
    )

    resp = client.get("/orders/history", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_admin_update_order_status(client, auth_headers, admin_headers):
    _fill_cart(client, auth_headers, admin_headers)
    order_resp = client.post(
        "/orders/place",
        json={"delivery_address": "5 Maple Ln", "payment_method": "card"},
        headers=auth_headers,
    )
    order_id = order_resp.json()["id"]

    update_resp = client.put(
        f"/admin/orders/{order_id}/status",
        json={"status": "packed"},
        headers=admin_headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "packed"


def test_admin_list_all_orders(client, auth_headers, admin_headers):
    _fill_cart(client, auth_headers, admin_headers)
    client.post(
        "/orders/place",
        json={"delivery_address": "7 Cedar Ct", "payment_method": "cod"},
        headers=auth_headers,
    )

    resp = client.get("/admin/orders", headers=admin_headers)
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_order_history_requires_auth(client):
    resp = client.get("/orders/history")
    assert resp.status_code == 401
