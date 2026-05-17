from sqlalchemy import String, Integer, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(100))  # e.g. "programming", "finance", "soft"

    user_skills: Mapped[list["UserSkill"]] = relationship("UserSkill", back_populates="skill")
    job_skills: Mapped[list["JobSkill"]] = relationship("JobSkill", back_populates="skill")
    course_skills: Mapped[list["CourseSkill"]] = relationship("CourseSkill", back_populates="skill")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("skills.id"))
    level: Mapped[float] = mapped_column(Float, default=0.0)  # 0.0 - 1.0

    user: Mapped["User"] = relationship("User", back_populates="skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="user_skills")
