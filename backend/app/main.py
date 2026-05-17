import json
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, SessionLocal
from app.routers import users, skills, jobs, courses, analysis, visits


def _auto_seed():
    """Import Gemini research data on startup if DB is empty."""
    from app.models.skill import Skill
    from app.models.job import Job, JobSkill
    from app.models.course import Course, CourseSkill

    db = SessionLocal()
    try:
        if db.query(Job).count() > 0:
            return  # ข้อมูลมีแล้ว ไม่ต้อง import ซ้ำ

        research_dir = os.path.join(os.path.dirname(__file__), "..", "..", "research", "data")
        jobs_path = os.path.join(research_dir, "jobs.json")
        courses_path = os.path.join(research_dir, "courses.json")

        if not os.path.exists(jobs_path):
            return

        category_map = {
            "AWS": "infrastructure", "Azure": "infrastructure", "Docker": "infrastructure",
            "Kubernetes": "infrastructure", "Terraform": "infrastructure",
            "Cloud Computing": "infrastructure", "CI/CD": "infrastructure",
            "Linux": "infrastructure", "Prometheus": "infrastructure",
            "ArgoCD": "infrastructure", "Helm": "infrastructure",
            "Grafana": "infrastructure", "GCP": "infrastructure",
            "React": "frontend", "TypeScript": "frontend", "Next.js": "frontend",
            "CSS": "frontend", "Vue.js": "frontend", "GraphQL": "frontend",
            "Machine Learning": "data", "Deep Learning": "data", "TensorFlow": "data",
            "Statistics": "data", "Data Analysis": "data", "Apache Spark": "data",
            "Kafka": "data", "Airflow": "data", "dbt": "data", "BigQuery": "data",
            "Snowflake": "data", "Databricks": "data", "Power BI": "data",
            "Tableau": "data",
            "Python": "programming", "SQL": "programming", "API Development": "programming",
            "Go": "backend", "Java": "backend", "Node.js": "backend",
            "PostgreSQL": "backend", "Redis": "backend", "Microservices": "backend",
            "REST API": "backend", "System Design": "backend", "MongoDB": "backend",
            "Elasticsearch": "backend", "RabbitMQ": "backend", "gRPC": "backend",
            "Swift": "mobile", "Kotlin": "mobile", "React Native": "mobile",
            "Firebase": "mobile", "Flutter": "mobile", "Dart": "mobile",
            "Network Security": "security", "Penetration Testing": "security",
            "SIEM": "security", "Data Privacy": "security",
            "OAuth 2.0 / OIDC": "security", "OWASP": "security", "Zero Trust": "security",
            "Financial Modeling": "finance", "Risk Management": "finance",
            "Blockchain": "fintech",
            "LangChain": "ai", "OpenAI API": "ai", "RAG": "ai", "Vector DB": "ai",
            "MLflow": "ai", "Kubeflow": "ai", "Model Monitoring": "ai",
            "Prompt Engineering": "ai", "PyTorch": "ai", "Hugging Face": "ai",
            "Computer Vision": "ai", "Feature Engineering": "ai",
            "Figma": "design", "User Research": "design",
            "Prototyping": "design", "Design Systems": "design",
            "HL7/FHIR": "domain", "Payment Gateway": "domain",
            "Playwright": "testing", "k6": "testing",
            "Agile / Scrum": "process",
        }

        def get_or_create_skill(name):
            s = db.query(Skill).filter_by(name=name).first()
            if not s:
                s = Skill(name=name, category=category_map.get(name, "general"))
                db.add(s)
                db.flush()
            return s

        with open(jobs_path) as f:
            for j in json.load(f):
                job = Job(title=j["title"], company=j.get("company"), industry=j["industry"],
                          salary_min=j.get("salary_min"), salary_max=j.get("salary_max"),
                          source=j.get("source"))
                db.add(job)
                db.flush()
                for skill_name, importance in j.get("skills", []):
                    skill = get_or_create_skill(skill_name)
                    db.add(JobSkill(job_id=job.id, skill_id=skill.id, importance=importance))

        with open(courses_path) as f:
            for c in json.load(f):
                course = Course(title=c["title"], provider=c["provider"],
                                url=c.get("url"), description=c.get("description"),
                                duration_hours=c.get("duration_hours"),
                                price_usd=c.get("price_usd"), rating=c.get("rating"))
                db.add(course)
                db.flush()
                for skill_name, coverage in c.get("skills", []):
                    skill = get_or_create_skill(skill_name)
                    db.add(CourseSkill(course_id=course.id, skill_id=skill.id, coverage=coverage))

        db.commit()
        print(f"[startup] seeded {db.query(Job).count()} jobs, {db.query(Course).count()} courses")
    except Exception as e:
        db.rollback()
        print(f"[startup] seed error: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    _auto_seed()
    yield


app = FastAPI(
    title="Skill-Gap Radar API",
    description="Analyze skill gaps and get course recommendations based on job market data",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(skills.router)
app.include_router(jobs.router)
app.include_router(courses.router)
app.include_router(analysis.router)
app.include_router(visits.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}
