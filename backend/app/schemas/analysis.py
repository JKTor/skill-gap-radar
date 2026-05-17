from pydantic import BaseModel


class GapItem(BaseModel):
    skill_id: int
    skill_name: str
    skill_category: str
    required_level: float
    current_level: float
    gap: float  # required - current (positive = missing skill)


class CourseRecommendation(BaseModel):
    course_id: int
    course_title: str
    provider: str
    url: str | None
    price_usd: float | None
    rating: float | None
    covers_skills: list[str]
    relevance_score: float  # how many gaps this course fills


class SkillGapResult(BaseModel):
    user_id: int
    target_role: str
    matched_jobs: int
    gaps: list[GapItem]
    recommended_courses: list[CourseRecommendation]
    gap_score: float  # 0.0 = no gap, 1.0 = completely missing skills
