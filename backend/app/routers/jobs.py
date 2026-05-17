from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job, JobSkill
from app.models.skill import Skill
from app.schemas.job import JobCreate, JobRead

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/titles")
def list_job_titles(db: Session = Depends(get_db)):
    """Distinct job titles for frontend role picker."""
    seen: set[str] = set()
    rows = db.query(Job.title, Job.industry).order_by(Job.title).all()
    result = []
    for r in rows:
        if r.title not in seen:
            seen.add(r.title)
            result.append({"title": r.title, "industry": r.industry})
    return result


@router.get("/", response_model=list[JobRead])
def list_jobs(
    industry: str | None = Query(default=None),
    title: str | None = Query(default=None),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0),
    db: Session = Depends(get_db),
):
    q = db.query(Job)
    if industry:
        q = q.filter(Job.industry == industry)
    if title:
        q = q.filter(Job.title.ilike(f"%{title}%"))
    return q.offset(offset).limit(limit).all()


@router.post("/", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    job = Job(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/{job_id}", response_model=JobRead)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/{job_id}/skills/{skill_id}", response_model=JobRead)
def add_job_skill(
    job_id: int,
    skill_id: int,
    importance: float = Query(default=1.0, ge=0.0, le=1.0),
    db: Session = Depends(get_db),
):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not db.get(Skill, skill_id):
        raise HTTPException(status_code=404, detail="Skill not found")

    existing = db.query(JobSkill).filter_by(job_id=job_id, skill_id=skill_id).first()
    if existing:
        existing.importance = importance
    else:
        db.add(JobSkill(job_id=job_id, skill_id=skill_id, importance=importance))
    db.commit()
    db.refresh(job)
    return job
