"""
Import Gemini's research data (research/data/*.json) into the backend DB.
Run from: skill-gap-radar/backend/
  python scripts/import_research.py
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.skill import Skill
from app.models.job import Job, JobSkill
from app.models.course import Course, CourseSkill

RESEARCH_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "research", "data")

CATEGORY_MAP = {
    "AWS": "infrastructure", "Azure": "infrastructure", "Docker": "infrastructure",
    "Kubernetes": "infrastructure", "Terraform": "infrastructure", "Cloud Computing": "infrastructure",
    "React": "frontend", "TypeScript": "frontend", "Next.js": "frontend", "CSS": "frontend",
    "Network Security": "security", "Penetration Testing": "security", "SIEM": "security",
    "Machine Learning": "data", "Deep Learning": "data", "TensorFlow": "data",
    "SQL": "data", "Python": "programming", "API Development": "programming",
    "Risk Management": "finance", "Financial Modeling": "finance",
}


def get_or_create_skill(db, name: str) -> Skill:
    skill = db.query(Skill).filter_by(name=name).first()
    if not skill:
        skill = Skill(name=name, category=CATEGORY_MAP.get(name, "general"))
        db.add(skill)
        db.flush()
    return skill


def import_jobs(db, jobs_data: list) -> int:
    count = 0
    for j in jobs_data:
        if db.query(Job).filter_by(title=j["title"], company=j["company"]).first():
            print(f"  skip job: {j['title']} @ {j['company']}")
            continue
        job = Job(
            title=j["title"], company=j["company"], industry=j["industry"],
            salary_min=j["salary_min"], salary_max=j["salary_max"], source=j["source"],
        )
        db.add(job)
        db.flush()
        for skill_name, importance in j["skills"]:
            skill = get_or_create_skill(db, skill_name)
            db.add(JobSkill(job_id=job.id, skill_id=skill.id, importance=importance))
        count += 1
    return count


def import_courses(db, courses_data: list) -> int:
    count = 0
    for c in courses_data:
        if db.query(Course).filter_by(title=c["title"], provider=c["provider"]).first():
            print(f"  skip course: {c['title']} by {c['provider']}")
            continue
        course = Course(
            title=c["title"], provider=c["provider"], url=c.get("url"),
            description=c.get("description"), duration_hours=c.get("duration_hours"),
            price_usd=c.get("price_usd"), rating=c.get("rating"),
        )
        db.add(course)
        db.flush()
        for skill_name, coverage in c["skills"]:
            skill = get_or_create_skill(db, skill_name)
            db.add(CourseSkill(course_id=course.id, skill_id=skill.id, coverage=coverage))
        count += 1
    return count


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        jobs_path = os.path.join(RESEARCH_DIR, "jobs.json")
        courses_path = os.path.join(RESEARCH_DIR, "courses.json")

        with open(jobs_path) as f:
            jobs_data = json.load(f)
        with open(courses_path) as f:
            courses_data = json.load(f)

        j_count = import_jobs(db, jobs_data)
        c_count = import_courses(db, courses_data)
        db.commit()
        print(f"Done — imported {j_count} jobs, {c_count} courses.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
