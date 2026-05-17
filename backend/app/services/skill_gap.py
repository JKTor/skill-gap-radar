from sqlalchemy.orm import Session

from app.models.user import User
from app.models.skill import Skill, UserSkill
from app.models.job import Job, JobSkill
from app.models.course import Course, CourseSkill
from app.schemas.analysis import SkillGapResult, GapItem, CourseRecommendation


def _build_gaps_and_courses(
    db: Session,
    target_role: str,
    user_skill_map: dict[int, float],
    user_id: int,
) -> SkillGapResult:
    jobs = db.query(Job).filter(Job.title.ilike(f"%{target_role}%")).all()

    if not jobs:
        return SkillGapResult(
            user_id=user_id,
            target_role=target_role,
            matched_jobs=0,
            gaps=[],
            recommended_courses=[],
            gap_score=0.0,
        )

    skill_requirement: dict[int, dict] = {}
    for job in jobs:
        for js in job.required_skills:
            if js.skill_id not in skill_requirement:
                skill_requirement[js.skill_id] = {
                    "skill": js.skill,
                    "total_importance": 0.0,
                    "count": 0,
                }
            skill_requirement[js.skill_id]["total_importance"] += js.importance
            skill_requirement[js.skill_id]["count"] += 1

    gaps: list[GapItem] = []
    for skill_id, data in skill_requirement.items():
        required_level = data["total_importance"] / data["count"]
        current_level = user_skill_map.get(skill_id, 0.0)
        gap = required_level - current_level
        if gap > 0.05:
            gaps.append(GapItem(
                skill_id=skill_id,
                skill_name=data["skill"].name,
                skill_category=data["skill"].category,
                required_level=round(required_level, 3),
                current_level=round(current_level, 3),
                gap=round(gap, 3),
            ))

    gaps.sort(key=lambda g: g.gap, reverse=True)
    gap_skill_ids = {g.skill_id for g in gaps}

    courses = (
        db.query(Course)
        .join(CourseSkill)
        .filter(CourseSkill.skill_id.in_(gap_skill_ids))
        .all()
    )

    recommendations: list[CourseRecommendation] = []
    for course in courses:
        covered = [cs.skill.name for cs in course.taught_skills if cs.skill_id in gap_skill_ids]
        if not covered:
            continue
        gap_coverage = sum(
            next((g.gap for g in gaps if g.skill_id == cs.skill_id), 0.0)
            for cs in course.taught_skills
            if cs.skill_id in gap_skill_ids
        )
        recommendations.append(CourseRecommendation(
            course_id=course.id,
            course_title=course.title,
            provider=course.provider,
            url=course.url,
            price_usd=course.price_usd,
            rating=course.rating,
            covers_skills=covered,
            relevance_score=round(gap_coverage, 3),
        ))

    recommendations.sort(key=lambda r: r.relevance_score, reverse=True)
    total_gap = sum(g.gap for g in gaps)
    max_possible = len(skill_requirement) * 1.0
    gap_score = round(min(total_gap / max_possible, 1.0), 3) if max_possible > 0 else 0.0

    return SkillGapResult(
        user_id=user_id,
        target_role=target_role,
        matched_jobs=len(jobs),
        gaps=gaps,
        recommended_courses=recommendations[:10],
        gap_score=gap_score,
    )


def analyze_skill_gap(db: Session, user: User, target_role: str) -> SkillGapResult:
    user_skill_map = {us.skill_id: us.level for us in user.skills}
    return _build_gaps_and_courses(db, target_role, user_skill_map, user.id)


def quick_analyze(db: Session, target_role: str, skills: list[dict]) -> SkillGapResult:
    """Stateless analysis — no user account needed. skills = [{name, level}]"""
    skill_name_map: dict[str, float] = {s["name"]: s["level"] for s in skills}

    # Resolve skill names to IDs
    user_skill_map: dict[int, float] = {}
    for name, level in skill_name_map.items():
        skill = db.query(Skill).filter(Skill.name.ilike(name)).first()
        if skill:
            user_skill_map[skill.id] = level

    return _build_gaps_and_courses(db, target_role, user_skill_map, user_id=0)
