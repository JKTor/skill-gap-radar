def test_create_and_list_skill(client):
    res = client.post("/skills/", json={"name": "Python", "category": "programming"})
    assert res.status_code == 201
    skill = res.json()
    assert skill["name"] == "Python"
    assert skill["id"] > 0

    res = client.get("/skills/")
    assert res.status_code == 200
    assert any(s["name"] == "Python" for s in res.json())


def test_duplicate_skill_rejected(client):
    client.post("/skills/", json={"name": "SQL", "category": "data"})
    res = client.post("/skills/", json={"name": "SQL", "category": "data"})
    assert res.status_code == 400


def test_filter_by_category(client):
    client.post("/skills/", json={"name": "React", "category": "frontend"})
    client.post("/skills/", json={"name": "Python", "category": "programming"})

    res = client.get("/skills/?category=frontend")
    skills = res.json()
    assert all(s["category"] == "frontend" for s in skills)
    assert any(s["name"] == "React" for s in skills)


def test_get_skill_not_found(client):
    res = client.get("/skills/999")
    assert res.status_code == 404
