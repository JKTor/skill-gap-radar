from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.schemas.skill import UserSkillCreate, UserSkillRead
from app.models.skill import Skill, UserSkill

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(**payload.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}/skills", response_model=list[UserSkillRead])
def get_user_skills(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.skills


@router.post("/{user_id}/skills", response_model=UserSkillRead, status_code=status.HTTP_201_CREATED)
def add_user_skill(user_id: int, payload: UserSkillCreate, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not db.get(Skill, payload.skill_id):
        raise HTTPException(status_code=404, detail="Skill not found")

    existing = db.query(UserSkill).filter_by(user_id=user_id, skill_id=payload.skill_id).first()
    if existing:
        existing.level = payload.level
        db.commit()
        db.refresh(existing)
        return existing

    us = UserSkill(user_id=user_id, **payload.model_dump())
    db.add(us)
    db.commit()
    db.refresh(us)
    return us


@router.delete("/{user_id}/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user_skill(user_id: int, skill_id: int, db: Session = Depends(get_db)):
    us = db.query(UserSkill).filter_by(user_id=user_id, skill_id=skill_id).first()
    if not us:
        raise HTTPException(status_code=404, detail="Skill not in user profile")
    db.delete(us)
    db.commit()
