def _seed(client):
    """Seed minimal data: 1 job requiring Python + ML, 1 course covering both."""
    python = client.post("/skills/", json={"name": "Python", "category": "programming"}).json()
    ml = client.post("/skills/", json={"name": "Machine Learning", "category": "data"}).json()

    job = client.post("/jobs/", json={
        "title": "Data Scientist", "company": "Test Co",
        "industry": "tech", "salary_min": 60000, "salary_max": 100000,
    }).json()
    client.post(f"/jobs/{job['id']}/skills/{python['id']}?importance=0.9")
    client.post(f"/jobs/{job['id']}/skills/{ml['id']}?importance=1.0")

    course = client.post("/courses/", json={
        "title": "ML with Python", "provider": "TestU",
        "price_usd": 20.0, "rating": 4.5,
    }).json()
    client.post(f"/courses/{course['id']}/skills/{ml['id']}?coverage=1.0")
    client.post(f"/courses/{course['id']}/skills/{python['id']}?coverage=0.8")

    return python, ml, job, course


def test_quick_analysis_no_skills(client):
    _seed(client)
    res = client.post("/analysis/quick", json={
        "target_role": "Data Scientist",
        "skills": [],
    })
    assert res.status_code == 200
    data = res.json()
    assert data["matched_jobs"] == 1
    assert data["gap_score"] > 0
    assert len(data["gaps"]) == 2
    assert len(data["recommended_courses"]) == 1


def test_quick_analysis_with_skills_reduces_gap(client):
    python, _, _, _ = _seed(client)

    res_no_skills = client.post("/analysis/quick", json={
        "target_role": "Data Scientist", "skills": [],
    }).json()

    res_with_python = client.post("/analysis/quick", json={
        "target_role": "Data Scientist",
        "skills": [{"name": "Python", "level": 0.9}],
    }).json()

    assert res_with_python["gap_score"] < res_no_skills["gap_score"]


def test_quick_analysis_unknown_role(client):
    res = client.post("/analysis/quick", json={
        "target_role": "Unicorn Wrangler",
        "skills": [],
    })
    assert res.status_code == 200
    assert res.json()["matched_jobs"] == 0
    assert res.json()["gaps"] == []


def test_job_titles_endpoint(client):
    _seed(client)
    res = client.get("/jobs/titles")
    assert res.status_code == 200
    titles = [t["title"] for t in res.json()]
    assert "Data Scientist" in titles


def test_skill_gap_by_user_id(client):
    python, ml, _, _ = _seed(client)
    user = client.post("/users/", json={
        "email": "ds@example.com", "name": "DS User", "target_role": "Data Scientist",
    }).json()
    client.post(f"/users/{user['id']}/skills", json={"skill_id": python["id"], "level": 0.9})

    res = client.get(f"/analysis/skill-gap/{user['id']}")
    assert res.status_code == 200
    data = res.json()
    assert data["matched_jobs"] == 1
    python_gap = next((g for g in data["gaps"] if g["skill_name"] == "Python"), None)
    assert python_gap is None or python_gap["gap"] < 0.2


def test_skill_gap_user_not_found(client):
    res = client.get("/analysis/skill-gap/9999")
    assert res.status_code == 404
