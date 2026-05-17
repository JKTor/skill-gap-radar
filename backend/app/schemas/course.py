from pydantic import BaseModel


class CourseSkillRead(BaseModel):
    skill_id: int
    coverage: float

    model_config = {"from_attributes": True}


class CourseCreate(BaseModel):
    title: str
    provider: str
    url: str | None = None
    description: str | None = None
    duration_hours: float | None = None
    price_usd: float | None = None
    rating: float | None = None


class CourseRead(BaseModel):
    id: int
    title: str
    provider: str
    url: str | None
    duration_hours: float | None
    price_usd: float | None
    rating: float | None
    taught_skills: list[CourseSkillRead] = []

    model_config = {"from_attributes": True}
