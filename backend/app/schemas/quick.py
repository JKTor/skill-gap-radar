from pydantic import BaseModel, Field


class QuickSkillInput(BaseModel):
    name: str
    level: float = Field(default=0.5, ge=0.0, le=1.0)


class QuickAnalysisRequest(BaseModel):
    target_role: str
    skills: list[QuickSkillInput]
