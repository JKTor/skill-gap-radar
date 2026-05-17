from pydantic import BaseModel


class JobSkillRead(BaseModel):
    skill_id: int
    importance: float

    model_config = {"from_attributes": True}


class JobCreate(BaseModel):
    title: str
    company: str | None = None
    description: str | None = None
    industry: str
    salary_min: int | None = None
    salary_max: int | None = None
    source: str | None = None


class JobRead(BaseModel):
    id: int
    title: str
    company: str | None
    industry: str
    salary_min: int | None
    salary_max: int | None
    source: str | None
    required_skills: list[JobSkillRead] = []

    model_config = {"from_attributes": True}
