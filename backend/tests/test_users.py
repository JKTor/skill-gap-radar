def test_create_user(client):
    res = client.post("/users/", json={"email": "test@example.com", "name": "Test User"})
    assert res.status_code == 201
    user = res.json()
    assert user["email"] == "test@example.com"
    assert user["id"] > 0


def test_duplicate_email_rejected(client):
    client.post("/users/", json={"email": "dup@example.com", "name": "A"})
    res = client.post("/users/", json={"email": "dup@example.com", "name": "B"})
    assert res.status_code == 400


def test_get_user(client):
    created = client.post("/users/", json={"email": "get@example.com", "name": "Get User"}).json()
    res = client.get(f"/users/{created['id']}")
    assert res.status_code == 200
    assert res.json()["name"] == "Get User"


def test_update_user(client):
    created = client.post("/users/", json={"email": "upd@example.com", "name": "Old"}).json()
    res = client.patch(f"/users/{created['id']}", json={"name": "New", "target_role": "Data Scientist"})
    assert res.status_code == 200
    assert res.json()["name"] == "New"
    assert res.json()["target_role"] == "Data Scientist"


def test_get_user_not_found(client):
    res = client.get("/users/9999")
    assert res.status_code == 404


def test_add_and_list_user_skills(client):
    skill = client.post("/skills/", json={"name": "Python", "category": "programming"}).json()
    user = client.post("/users/", json={"email": "skill@example.com", "name": "Skilled"}).json()

    res = client.post(f"/users/{user['id']}/skills", json={"skill_id": skill["id"], "level": 0.8})
    assert res.status_code == 201
    assert res.json()["level"] == 0.8

    skills = client.get(f"/users/{user['id']}/skills").json()
    assert len(skills) == 1
    assert skills[0]["skill"]["name"] == "Python"


def test_update_existing_user_skill(client):
    skill = client.post("/skills/", json={"name": "SQL", "category": "data"}).json()
    user = client.post("/users/", json={"email": "upskill@example.com", "name": "U"}).json()

    client.post(f"/users/{user['id']}/skills", json={"skill_id": skill["id"], "level": 0.3})
    res = client.post(f"/users/{user['id']}/skills", json={"skill_id": skill["id"], "level": 0.9})
    assert res.status_code == 201
    assert res.json()["level"] == 0.9
