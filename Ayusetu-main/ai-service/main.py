"""
FastAPI AI Service for Academia-Industry Collaboration Portal
Handles skill analysis, recommendations, resume parsing, and match scoring
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import os
import re
import io
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Academia-Industry Portal AI Service",
    description="AI/ML microservice for skill analysis and recommendations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("BACKEND_URL", "http://localhost:5000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Pydantic Models ──────────────────────────────────────────────────────────

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    errors: Optional[List[Dict[str, str]]] = None


class SkillBenchmark(BaseModel):
    skill_id: str
    name: str
    industry_benchmark: float  # 0-100


class AssessmentAnswer(BaseModel):
    question_id: str
    skill_id: str
    skill_name: str
    selected_option: int
    correct_answer: int


class AnalyzeSkillsRequest(BaseModel):
    student_id: str
    answers: List[AssessmentAnswer]
    skill_benchmarks: List[SkillBenchmark]


class StudentSkill(BaseModel):
    name: str
    score: float


class RequiredSkill(BaseModel):
    name: str
    required_score: float


class MatchScoreRequest(BaseModel):
    student_skills: List[StudentSkill]
    required_skills: List[RequiredSkill]
    soft_skill_match: Optional[float] = 70
    education_match: Optional[float] = 80
    career_interest_match: Optional[float] = 70
    projects_match: Optional[float] = 70
    location_match: Optional[float] = 100


class OpportunityForRecommendation(BaseModel):
    opportunity_id: str
    title: str
    required_skills: List[RequiredSkill]
    gap_coverage: Optional[str] = None  # 'major', 'significant', 'moderate', 'ready'


class RecommendationRequest(BaseModel):
    student_id: str
    student_skills: List[StudentSkill]
    skill_gaps: List[Dict[str, Any]]  # [{skill_name, gap, gap_priority}]
    opportunities: List[OpportunityForRecommendation]
    is_placed: Optional[bool] = False


# ─── Skill Gap Scoring Logic (mirrors Node.js scoring.ts) ────────────────────

def compute_skill_gap(required: float, student: float) -> Dict[str, Any]:
    """Property 1: gap = required - student, classified by thresholds"""
    gap = max(0.0, required - student)
    if gap <= 10:
        priority = "ready"
    elif gap <= 25:
        priority = "moderate"
    elif gap <= 40:
        priority = "significant"
    else:
        priority = "major"
    return {"gap": round(gap, 1), "gap_priority": priority}


def compute_match_score(
    technical: float,
    soft: float,
    education: float,
    career: float,
    projects: float,
    location: float,
) -> float:
    """Property 2 & 3: weighted match score, bounded [0, 100]"""
    score = (
        technical * 0.50
        + soft * 0.15
        + education * 0.10
        + career * 0.10
        + projects * 0.10
        + location * 0.05
    )
    return round(min(100.0, max(0.0, score)), 1)


def compute_technical_skill_match(
    student_skills: List[StudentSkill],
    required_skills: List[RequiredSkill],
) -> float:
    if not required_skills:
        return 100.0
    skill_map = {s.name.lower(): s.score for s in student_skills}
    total = 0.0
    for req in required_skills:
        student_score = skill_map.get(req.name.lower(), 0.0)
        if req.required_score > 0:
            total += min(100.0, (student_score / req.required_score) * 100)
        else:
            total += 100.0
    return round(min(100.0, max(0.0, total / len(required_skills))), 1)


# ─── Skill alias normalization table ─────────────────────────────────────────

SKILL_ALIASES: Dict[str, str] = {
    "reactjs": "React", "react.js": "React", "react js": "React",
    "nodejs": "Node.js", "node.js": "Node.js", "node js": "Node.js",
    "expressjs": "Express.js", "express.js": "Express.js",
    "vuejs": "Vue.js", "vue.js": "Vue.js",
    "angularjs": "Angular", "angular.js": "Angular",
    "javascript": "JavaScript", "js": "JavaScript",
    "typescript": "TypeScript", "ts": "TypeScript",
    "python3": "Python", "python 3": "Python",
    "postgresql": "PostgreSQL", "postgres": "PostgreSQL",
    "mongodb": "MongoDB", "mongo": "MongoDB",
    "mysql": "MySQL", "ms sql": "MSSQL", "mssql": "MSSQL",
    "html5": "HTML", "html 5": "HTML",
    "css3": "CSS", "css 3": "CSS",
    "machine learning": "Machine Learning", "ml": "Machine Learning",
    "deep learning": "Deep Learning", "dl": "Deep Learning",
    "artificial intelligence": "AI",
    "natural language processing": "NLP",
    "computer vision": "Computer Vision",
    "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
    "aws": "AWS", "azure": "Azure", "gcp": "GCP", "google cloud": "GCP",
    "git": "Git", "github": "GitHub", "gitlab": "GitLab",
    "java": "Java", "c++": "C++", "c#": "C#", "golang": "Go", "go lang": "Go",
    "rust": "Rust", "swift": "Swift", "kotlin": "Kotlin",
    "django": "Django", "flask": "Flask", "fastapi": "FastAPI",
    "spring": "Spring", "spring boot": "Spring Boot",
    "tensorflow": "TensorFlow", "tf": "TensorFlow",
    "pytorch": "PyTorch", "scikit-learn": "Scikit-learn", "sklearn": "Scikit-learn",
}

# Common tech skill keywords for resume extraction
KNOWN_SKILLS = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin",
    "React", "Node.js", "Express.js", "Vue.js", "Angular", "Django", "Flask", "FastAPI",
    "Spring Boot", "Spring", "HTML", "CSS", "TailwindCSS", "Bootstrap",
    "MongoDB", "PostgreSQL", "MySQL", "MSSQL", "Redis", "Elasticsearch",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "GitHub", "GitLab",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch",
    "Scikit-learn", "NumPy", "Pandas", "SQL", "GraphQL", "REST", "Microservices",
    "Linux", "Bash", "Agile", "Scrum", "CI/CD", "DevOps", "Terraform",
]


def normalize_skill(raw: str) -> str:
    """Normalize a skill alias to its canonical name (Property 11)"""
    clean = raw.strip().lower()
    return SKILL_ALIASES.get(clean, raw.strip())


def extract_skills_from_text(text: str) -> List[str]:
    """Extract and normalize skills from plain text"""
    found = set()
    text_lower = text.lower()

    # Check known skills and their aliases
    for canonical in KNOWN_SKILLS:
        if canonical.lower() in text_lower:
            found.add(canonical)

    for alias, canonical in SKILL_ALIASES.items():
        # Use word-boundary matching
        pattern = r'\b' + re.escape(alias) + r'\b'
        if re.search(pattern, text_lower):
            found.add(canonical)

    return sorted(found)


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return ApiResponse(success=True, message="AI Service is running", data={"version": "1.0.0"})


@app.get("/health")
async def health_check():
    return ApiResponse(success=True, message="AI service is healthy", data={"status": "operational"})


@app.post("/ai/analyze-skills")
async def analyze_skills(request: AnalyzeSkillsRequest):
    """
    Compute Skill_Profile and Skill_Gap from assessment answers
    Requirements: 2.2, 8.1
    """
    # Group answers by skill
    skill_scores: Dict[str, Dict[str, Any]] = {}
    for ans in request.answers:
        key = ans.skill_id
        if key not in skill_scores:
            skill_scores[key] = {"skill_id": ans.skill_id, "skill_name": ans.skill_name, "correct": 0, "total": 0}
        skill_scores[key]["total"] += 1
        if ans.selected_option == ans.correct_answer:
            skill_scores[key]["correct"] += 1

    benchmark_map = {b.skill_id: b for b in request.skill_benchmarks}

    skill_profile = []
    for key, entry in skill_scores.items():
        score = round((entry["correct"] / entry["total"]) * 100) if entry["total"] > 0 else 0
        benchmark = benchmark_map.get(key)
        required = benchmark.industry_benchmark if benchmark else 70.0
        gap_result = compute_skill_gap(required, score)

        skill_profile.append({
            "skill_id": entry["skill_id"],
            "skill_name": entry["skill_name"],
            "score": score,
            "gap": gap_result["gap"],
            "gap_priority": gap_result["gap_priority"],
            "required_score": required,
        })

    total_score = round(sum(s["score"] for s in skill_profile) / len(skill_profile)) if skill_profile else 0

    return ApiResponse(
        success=True,
        message="Skill analysis complete",
        data={"student_id": request.student_id, "total_score": total_score, "skill_profile": skill_profile},
    )


@app.post("/ai/match-score")
async def match_score(request: MatchScoreRequest):
    """
    Compute Match_Score for a student–opportunity pair
    Requirements: 3.3, 8.2
    """
    tech_match = compute_technical_skill_match(request.student_skills, request.required_skills)
    score = compute_match_score(
        technical=tech_match,
        soft=request.soft_skill_match or 70,
        education=request.education_match or 80,
        career=request.career_interest_match or 70,
        projects=request.projects_match or 70,
        location=request.location_match or 100,
    )
    return ApiResponse(
        success=True,
        message="Match score computed",
        data={"match_score": score, "technical_skill_match": tech_match},
    )


@app.post("/ai/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """
    Return ranked opportunities ordered by Match_Score and gap priority
    Requirements: 3.1, 3.2, 3.3, 6.6, 8.3
    Property 5: Major Gap programs ranked before Moderate Gap
    Property 12: Placed student excluded
    """
    # Property 12: Exclude placed students
    if request.is_placed:
        return ApiResponse(
            success=True,
            message="Student is already placed",
            data={"recommendations": []},
        )

    priority_order = {"major": 4, "significant": 3, "moderate": 2, "ready": 1}
    gap_map = {g["skill_name"].lower(): g for g in request.skill_gaps}

    ranked = []
    for opp in request.opportunities:
        tech_match = compute_technical_skill_match(request.student_skills, opp.required_skills)
        score = compute_match_score(
            technical=tech_match,
            soft=70, education=80, career=70, projects=70, location=100,
        )

        # Determine highest gap priority covered by this opportunity
        highest_gap_priority = 0
        for req_skill in opp.required_skills:
            gap_info = gap_map.get(req_skill.name.lower())
            if gap_info:
                p = priority_order.get(gap_info.get("gap_priority", "ready"), 1)
                highest_gap_priority = max(highest_gap_priority, p)

        ranked.append({
            "opportunity_id": opp.opportunity_id,
            "title": opp.title,
            "match_score": score,
            "highest_gap_priority": highest_gap_priority,
        })

    # Sort: highest gap priority first (Property 5), then by match score
    ranked.sort(key=lambda x: (x["highest_gap_priority"], x["match_score"]), reverse=True)

    return ApiResponse(
        success=True,
        message="Recommendations generated",
        data={"recommendations": ranked},
    )


@app.post("/ai/extract-resume-skills")
async def extract_resume_skills(file: UploadFile = File(...)):
    """
    Parse resume and extract normalized skills
    Requirements: 14.1, 14.2, 14.3, 9.1, 9.3
    Property 11: Normalization idempotence
    """
    content = await file.read()
    text = ""

    try:
        filename = file.filename or ""
        if filename.lower().endswith(".pdf"):
            try:
                import PyPDF2
                reader = PyPDF2.PdfReader(io.BytesIO(content))
                text = " ".join(page.extract_text() or "" for page in reader.pages)
            except Exception:
                text = content.decode("utf-8", errors="ignore")
        elif filename.lower().endswith(".docx"):
            try:
                import docx
                doc = docx.Document(io.BytesIO(content))
                text = " ".join(p.text for p in doc.paragraphs)
            except Exception:
                text = content.decode("utf-8", errors="ignore")
        else:
            text = content.decode("utf-8", errors="ignore")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    skills = extract_skills_from_text(text)

    return ApiResponse(
        success=True,
        message="Skills extracted successfully",
        data={"extracted_skills": skills, "count": len(skills)},
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
