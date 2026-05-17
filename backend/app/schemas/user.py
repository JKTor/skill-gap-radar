from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    target_role: str | None = None


class UserUpdate(BaseModel):
    name: str | None = None
    target_role: str | None = None


class UserRead(BaseModel):
    id: int
    email: str
    name: str
    target_role: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
