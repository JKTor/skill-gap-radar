from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillRead

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("/", response_model=list[SkillRead])
def list_skills(
    category: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    q = db.query(Skill)
    if category:
        q = q.filter(Skill.category == category)
    return q.order_by(Skill.name).all()


@router.post("/", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
def create_skill(payload: SkillCreate, db: Session = Depends(get_db)):
    if db.query(Skill).filter(Skill.name == payload.name).first():
        raise HTTPException(status_code=400, detail="Skill already exists")
    skill = Skill(**payload.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.get("/{skill_id}", response_model=SkillRead)
def get_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = db.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill
