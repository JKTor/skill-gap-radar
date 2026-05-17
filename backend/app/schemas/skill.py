from pydantic import BaseModel, Field


class SkillCreate(BaseModel):
    name: str
    category: str


class SkillRead(BaseModel):
    id: int
    name: str
    category: str

    model_config = {"from_attributes": True}


class UserSkillCreate(BaseModel):
    skill_id: int
    level: float = Field(default=0.5, ge=0.0, le=1.0)


class UserSkillRead(BaseModel):
    id: int
    skill_id: int
    skill: SkillRead
    level: float

    model_config = {"from_attributes": True}
