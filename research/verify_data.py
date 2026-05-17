import os
import sys

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.database import SessionLocal
from app.models.job import Job
from app.models.course import Course
from app.models.skill import Skill

def verify():
    db = SessionLocal()
    
    job_count = db.query(Job).count()
    course_count = db.query(Course).count()
    skill_count = db.query(Skill).count()
    
    print(f"Total Jobs: {job_count}")
    print(f"Total Courses: {course_count}")
    print(f"Total Skills: {skill_count}")
    
    print("\nSample Jobs:")
    for j in db.query(Job).limit(5).all():
        print(f"- {j.title} at {j.company}")
        
    print("\nSample Courses:")
    for c in db.query(Course).limit(5).all():
        print(f"- {c.title} by {c.provider}")
        
    db.close()

if __name__ == "__main__":
    verify()
