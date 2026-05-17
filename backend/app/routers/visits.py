from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.visit import Visit

router = APIRouter(prefix="/visits", tags=["visits"])


@router.post("/", status_code=201)
def record_visit(page: str = "home", db: Session = Depends(get_db)):
    db.add(Visit(page=page))
    db.commit()
    return {"recorded": True}


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=6)

    total = db.query(func.count(Visit.id)).scalar()
    today = db.query(func.count(Visit.id)).filter(Visit.visited_at >= today_start).scalar()

    # นับแต่ละวัน 7 วันย้อนหลัง
    daily = []
    for i in range(6, -1, -1):
        day_start = today_start - timedelta(days=i)
        day_end = day_start + timedelta(days=1)
        count = db.query(func.count(Visit.id)).filter(
            Visit.visited_at >= day_start,
            Visit.visited_at < day_end,
        ).scalar()
        daily.append({
            "date": day_start.strftime("%d/%m"),
            "count": count,
        })

    return {
        "total": total,
        "today": today,
        "this_week": db.query(func.count(Visit.id)).filter(Visit.visited_at >= week_start).scalar(),
        "daily": daily,
    }
