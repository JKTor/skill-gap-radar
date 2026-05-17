from sqlalchemy import String, Integer, ForeignKey, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    provider: Mapped[str] = mapped_column(String(100))  # e.g. "Coursera", "Udemy"
    url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    price_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    rating: Mapped[float | None] = mapped_column(Float, nullable=True)

    taught_skills: Mapped[list["CourseSkill"]] = relationship("CourseSkill", back_populates="course", cascade="all, delete-orphan")


class CourseSkill(Base):
    __tablename__ = "course_skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"))
    skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("skills.id"))
    coverage: Mapped[float] = mapped_column(Float, default=1.0)  # how well course covers this skill

    course: Mapped["Course"] = relationship("Course", back_populates="taught_skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="course_skills")
