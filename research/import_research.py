import json
import os
import sys

# Add backend to path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.database import SessionLocal, engine, Base
from app.models.skill import Skill
from app.models.job import Job, JobSkill
from app.models.course import Course, CourseSkill

def import_data():
    db = SessionLocal()
    
    # Load JSON files
    research_dir = os.path.dirname(__file__)
    jobs_file = os.path.join(research_dir, "data", "jobs.json")
    courses_file = os.path.join(research_dir, "data", "courses.json")
    
    with open(jobs_file, "r") as f:
        jobs_data = json.load(f)
        
    with open(courses_file, "r") as f:
        courses_data = json.load(f)
        
    # Helper to get or create skill
    def get_or_create_skill(name):
        skill = db.query(Skill).filter_by(name=name).first()
        if not skill:
            # Guess category
            category = "general"
            infra_skills = ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Cloud Computing", "Linux", "Prometheus", "CI/CD", "ArgoCD", "Helm", "Grafana", "GCP"]
            frontend_skills = ["React", "TypeScript", "Next.js", "CSS", "Vue.js", "GraphQL"]
            security_skills = ["Network Security", "Penetration Testing", "SIEM", "Risk Management", "Data Privacy", "OAuth 2.0 / OIDC", "OWASP", "Zero Trust"]
            data_skills = ["Machine Learning", "Deep Learning", "TensorFlow", "SQL", "Python", "Apache Spark", "Kafka", "Airflow", "BigQuery", "dbt", "Statistics", "Power BI", "Tableau", "Snowflake", "Databricks", "Data Analysis", "Feature Engineering"]
            backend_skills = ["Go", "Java", "PostgreSQL", "Redis", "Microservices", "REST API", "Node.js", "FastAPI", "System Design", "MongoDB", "Elasticsearch", "RabbitMQ", "gRPC"]
            ai_skills = ["Prompt Engineering", "LangChain", "OpenAI API", "RAG", "Vector DB", "MLflow", "Kubeflow", "Model Monitoring", "PyTorch", "Hugging Face", "Computer Vision"]
            mobile_skills = ["Swift", "Kotlin", "React Native", "Firebase", "App Store Deployment", "Flutter", "Dart"]
            design_skills = ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"]
            testing_skills = ["Playwright", "k6"]
            process_skills = ["Agile / Scrum"]
            domain_skills = ["HL7/FHIR", "Financial Modeling", "Blockchain", "Payment Gateway"]
            
            if name in infra_skills: category = "infrastructure"
            elif name in frontend_skills: category = "frontend"
            elif name in security_skills: category = "security"
            elif name in data_skills: category = "data"
            elif name in backend_skills: category = "backend"
            elif name in ai_skills: category = "ai"
            elif name in mobile_skills: category = "mobile"
            elif name in design_skills: category = "design"
            elif name in testing_skills: category = "testing"
            elif name in process_skills: category = "process"
            elif name in domain_skills: category = "domain"
            
            skill = Skill(name=name, category=category)
            db.add(skill)
            db.flush()
        return skill

    # Import Jobs
    for j in jobs_data:
        # Avoid duplicates based on title and company
        existing_job = db.query(Job).filter_by(title=j["title"], company=j["company"]).first()
        if existing_job:
            print(f"Skipping job: {j['title']} at {j['company']} (already exists)")
            continue
            
        job = Job(
            title=j["title"],
            company=j["company"],
            industry=j["industry"],
            salary_min=j["salary_min"],
            salary_max=j["salary_max"],
            source=j["source"]
        )
        db.add(job)
        db.flush()
        
        for skill_name, importance in j["skills"]:
            skill = get_or_create_skill(skill_name)
            db.add(JobSkill(job_id=job.id, skill_id=skill.id, importance=importance))
            
    # Import Courses
    for c in courses_data:
        # Avoid duplicates based on title and provider
        existing_course = db.query(Course).filter_by(title=c["title"], provider=c["provider"]).first()
        if existing_course:
            print(f"Skipping course: {c['title']} by {c['provider']} (already exists)")
            continue
            
        course = Course(
            title=c["title"],
            provider=c["provider"],
            url=c["url"],
            description=c.get("description"),
            duration_hours=c.get("duration_hours"),
            price_usd=c.get("price_usd"),
            rating=c.get("rating")
        )
        db.add(course)
        db.flush()
        
        for skill_name, coverage in c["skills"]:
            skill = get_or_create_skill(skill_name)
            db.add(CourseSkill(course_id=course.id, skill_id=skill.id, coverage=coverage))
            
    db.commit()
    db.close()
    print("Research data import complete.")

if __name__ == "__main__":
    import_data()
