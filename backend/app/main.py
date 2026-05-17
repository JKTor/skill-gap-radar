from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import users, skills, jobs, courses, analysis

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Skill-Gap Radar API",
    description="Analyze skill gaps and get course recommendations based on job market data",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(skills.router)
app.include_router(jobs.router)
app.include_router(courses.router)
app.include_router(analysis.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}
