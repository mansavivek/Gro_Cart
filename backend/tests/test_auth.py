def test_register_success(client):
    resp = client.post(
        "/auth/register",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "password": "secret123",
            "phone_number": "9999999999",
            "address": "1 Main St",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "alice@example.com"
    assert data["name"] == "Alice"
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    payload = {"name": "Bob", "email": "bob@example.com", "password": "pass123"}
    client.post("/auth/register", json=payload)
    resp = client.post("/auth/register", json=payload)
    assert resp.status_code == 400


def test_login_success(client, registered_user):
    resp = client.post(
        "/auth/login",
        json={"email": registered_user["email"], "password": registered_user["password"]},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user):
    resp = client.post(
        "/auth/login",
        json={"email": registered_user["email"], "password": "wrongpassword"},
    )
    assert resp.status_code == 401


def test_get_me(client, auth_headers):
    resp = client.get("/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "test@example.com"


def test_get_me_no_token(client):
    resp = client.get("/auth/me")
    assert resp.status_code == 401
