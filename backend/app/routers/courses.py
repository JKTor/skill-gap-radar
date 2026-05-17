from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course import Course, CourseSkill
from app.models.skill import Skill
from app.schemas.course import CourseCreate, CourseRead

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("/", response_model=list[CourseRead])
def list_courses(
    provider: str | None = Query(default=None),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0),
    db: Session = Depends(get_db),
):
    q = db.query(Course)
    if provider:
        q = q.filter(Course.provider == provider)
    return q.offset(offset).limit(limit).all()


@router.post("/", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(**payload.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("/{course_id}", response_model=CourseRead)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("/{course_id}/skills/{skill_id}", response_model=CourseRead)
def add_course_skill(
    course_id: int,
    skill_id: int,
    coverage: float = Query(default=1.0, ge=0.0, le=1.0),
    db: Session = Depends(get_db),
):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if not db.get(Skill, skill_id):
        raise HTTPException(status_code=404, detail="Skill not found")

    existing = db.query(CourseSkill).filter_by(course_id=course_id, skill_id=skill_id).first()
    if existing:
        existing.coverage = coverage
    else:
        db.add(CourseSkill(course_id=course_id, skill_id=skill_id, coverage=coverage))
    db.commit()
    db.refresh(course)
    return course
