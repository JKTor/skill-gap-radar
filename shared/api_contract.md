# Skill-Gap Radar — API Contract

Base URL (dev): `http://localhost:8000`

---

## Endpoints

### Health
`GET /health` → `{ status, version }`

---

### Users
| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/users/` | `{email, name, target_role?}` | UserRead |
| GET | `/users/{id}` | — | UserRead |
| PATCH | `/users/{id}` | `{name?, target_role?}` | UserRead |
| GET | `/users/{id}/skills` | — | UserSkillRead[] |
| POST | `/users/{id}/skills` | `{skill_id, level}` | UserSkillRead |
| DELETE | `/users/{id}/skills/{skill_id}` | — | 204 |

### Skills
| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/skills/?category=` | — | SkillRead[] |
| POST | `/skills/` | `{name, category}` | SkillRead |
| GET | `/skills/{id}` | — | SkillRead |

### Jobs
| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/jobs/?industry=&title=` | — | JobRead[] |
| POST | `/jobs/` | `{title, company?, industry, salary_min?, salary_max?}` | JobRead |
| GET | `/jobs/{id}` | — | JobRead |
| POST | `/jobs/{id}/skills/{skill_id}?importance=` | — | JobRead |

### Courses
| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/courses/?provider=` | — | CourseRead[] |
| POST | `/courses/` | `{title, provider, url?, ...}` | CourseRead |
| GET | `/courses/{id}` | — | CourseRead |
| POST | `/courses/{id}/skills/{skill_id}?coverage=` | — | CourseRead |

### Analysis ⭐ (core feature)
`GET /analysis/skill-gap/{user_id}?target_role=`

**Response:**
```json
{
  "user_id": 1,
  "target_role": "Data Scientist",
  "matched_jobs": 3,
  "gap_score": 0.42,
  "gaps": [
    { "skill_id": 3, "skill_name": "Machine Learning", "skill_category": "data",
      "required_level": 0.95, "current_level": 0.3, "gap": 0.65 }
  ],
  "recommended_courses": [
    { "course_id": 2, "course_title": "Machine Learning A-Z", "provider": "Udemy",
      "url": "...", "price_usd": 15.0, "rating": 4.6,
      "covers_skills": ["Machine Learning", "Statistics"], "relevance_score": 1.45 }
  ]
}
```

---

## Data Types

| Field | Type | Notes |
|-------|------|-------|
| level | float 0–1 | user's proficiency |
| importance | float 0–1 | how critical skill is for job |
| coverage | float 0–1 | how well course covers a skill |
| gap | float 0–1 | required - current |
| gap_score | float 0–1 | 0 = no gap, 1 = fully missing |
