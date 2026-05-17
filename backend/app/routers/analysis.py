from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.analysis import SkillGapResult
from app.schemas.quick import QuickAnalysisRequest
from app.services.skill_gap import analyze_skill_gap, quick_analyze

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/quick", response_model=SkillGapResult)
def quick_skill_gap(payload: QuickAnalysisRequest, db: Session = Depends(get_db)):
    """Stateless analysis — no account needed. Send your skills + target role, get gaps back."""
    return quick_analyze(db, payload.target_role, [s.model_dump() for s in payload.skills])


@router.get("/skill-gap/{user_id}", response_model=SkillGapResult)
def get_skill_gap(
    user_id: int,
    target_role: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = target_role or user.target_role
    if not role:
        raise HTTPException(status_code=400, detail="Provide target_role or set it on the user profile")

    return analyze_skill_gap(db, user, role)
