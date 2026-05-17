"""Run once to populate DB with sample FinTech skills, jobs, and courses."""
from app.database import SessionLocal, engine, Base
from app.models.skill import Skill, UserSkill
from app.models.job import Job, JobSkill
from app.models.course import Course, CourseSkill
from app.models.user import User

Base.metadata.create_all(bind=engine)

db = SessionLocal()

SKILLS = [
    ("Python", "programming"),
    ("SQL", "programming"),
    ("Machine Learning", "data"),
    ("Data Analysis", "data"),
    ("Financial Modeling", "finance"),
    ("Risk Management", "finance"),
    ("Blockchain", "fintech"),
    ("API Development", "programming"),
    ("React", "frontend"),
    ("Statistics", "data"),
]

skill_objs = {}
for name, cat in SKILLS:
    s = db.query(Skill).filter_by(name=name).first()
    if not s:
        s = Skill(name=name, category=cat)
        db.add(s)
        db.flush()
    skill_objs[name] = s

JOBS = [
    {
        "title": "Data Scientist - FinTech",
        "company": "Kasikorn Bank",
        "industry": "banking",
        "salary_min": 60000,
        "salary_max": 120000,
        "source": "seed",
        "skills": [("Python", 1.0), ("Machine Learning", 1.0), ("SQL", 0.8), ("Statistics", 0.9)],
    },
    {
        "title": "Financial Analyst",
        "company": "SCB Securities",
        "industry": "finance",
        "salary_min": 40000,
        "salary_max": 80000,
        "source": "seed",
        "skills": [("Financial Modeling", 1.0), ("SQL", 0.7), ("Data Analysis", 0.9), ("Risk Management", 0.8)],
    },
    {
        "title": "Blockchain Developer",
        "company": "Bitkub",
        "industry": "fintech",
        "salary_min": 80000,
        "salary_max": 150000,
        "source": "seed",
        "skills": [("Blockchain", 1.0), ("Python", 0.8), ("API Development", 0.9)],
    },
    {
        "title": "Quantitative Analyst",
        "company": "TMB Thanachart",
        "industry": "banking",
        "salary_min": 70000,
        "salary_max": 130000,
        "source": "seed",
        "skills": [("Statistics", 1.0), ("Python", 0.9), ("Financial Modeling", 0.8), ("Machine Learning", 0.7)],
    },
]

for j in JOBS:
    job = Job(
        title=j["title"],
        company=j["company"],
        industry=j["industry"],
        salary_min=j["salary_min"],
        salary_max=j["salary_max"],
        source=j["source"],
    )
    db.add(job)
    db.flush()
    for skill_name, importance in j["skills"]:
        db.add(JobSkill(job_id=job.id, skill_id=skill_objs[skill_name].id, importance=importance))

COURSES = [
    {
        "title": "Python for Finance",
        "provider": "Coursera",
        "url": "https://coursera.org",
        "duration_hours": 30.0,
        "price_usd": 49.0,
        "rating": 4.7,
        "skills": [("Python", 0.9), ("Financial Modeling", 0.6), ("Data Analysis", 0.7)],
    },
    {
        "title": "Machine Learning A-Z",
        "provider": "Udemy",
        "url": "https://udemy.com",
        "duration_hours": 44.0,
        "price_usd": 15.0,
        "rating": 4.6,
        "skills": [("Machine Learning", 1.0), ("Python", 0.7), ("Statistics", 0.8)],
    },
    {
        "title": "Blockchain Fundamentals",
        "provider": "edX",
        "url": "https://edx.org",
        "duration_hours": 20.0,
        "price_usd": 0.0,
        "rating": 4.5,
        "skills": [("Blockchain", 1.0), ("API Development", 0.5)],
    },
    {
        "title": "Financial Risk Management",
        "provider": "Coursera",
        "url": "https://coursera.org",
        "duration_hours": 25.0,
        "price_usd": 49.0,
        "rating": 4.4,
        "skills": [("Risk Management", 1.0), ("Financial Modeling", 0.7), ("Statistics", 0.6)],
    },
]

for c in COURSES:
    course = Course(
        title=c["title"],
        provider=c["provider"],
        url=c["url"],
        duration_hours=c["duration_hours"],
        price_usd=c["price_usd"],
        rating=c["rating"],
    )
    db.add(course)
    db.flush()
    for skill_name, coverage in c["skills"]:
        db.add(CourseSkill(course_id=course.id, skill_id=skill_objs[skill_name].id, coverage=coverage))

db.commit()
db.close()
print("Seed complete.")
