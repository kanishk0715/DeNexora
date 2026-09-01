"""
FastAPI AI Service for Academia-Industry Collaboration Portal
Handles skill analysis, recommendations, resume parsing, and match scoring
Uses NLP embeddings for semantic skill matching
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import os
import re
import io
from dotenv import load_dotenv
from embedding_service import get_embedding_service
from nlp_pipeline import (
    analyze_resume,
    classify_research,
    cluster_skill_demand,
    explain_match,
    flag_inconsistent_assessment,
    generate_mcq_stub,
    rag_answer,
    rank_applicants,
    read_upload_bytes,
    score_written_answer,
    summarize_text,
    transliterate_terms,
)
from ayush_ontology import CANONICAL_SKILLS as AYUSH_SKILLS

load_dotenv()

app = FastAPI(
    title="Academia-Industry Portal AI Service",
    description="AI/ML microservice for skill analysis and recommendations",
    version="1.0.0"
)

_cors = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:5000",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _cors.split(",") if o.strip()],
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


class SemanticSkillMatchRequest(BaseModel):
    query_skill: str
    candidate_skills: List[str]
    threshold: Optional[float] = 0.7
    top_k: Optional[int] = 5


class SemanticResumeRequest(BaseModel):
    use_semantic: Optional[bool] = True
    confidence_threshold: Optional[float] = 0.65


class SkillRelationshipRequest(BaseModel):
    skill: str
    all_skills: List[str]
    top_k: Optional[int] = 5


class StudentProfileMatchRequest(BaseModel):
    student_profile: str
    opportunity_descriptions: List[Dict[str, str]]  # [{id, description}]
    top_k: Optional[int] = 10


class ExplainMatchRequest(BaseModel):
    title: Optional[str] = ""
    student_skills: List[Dict[str, Any]]
    required_skills: List[Dict[str, Any]]


class RankApplicantsRequest(BaseModel):
    posting: Dict[str, Any]
    applicants: List[Dict[str, Any]]


class WrittenScoreRequest(BaseModel):
    student_answer: str
    model_answer: str
    keywords: Optional[List[str]] = None


class AssessmentFlagRequest(BaseModel):
    answers: List[Dict[str, Any]]


class McqDraftRequest(BaseModel):
    subject: str
    source_note: str


class ChatRequest(BaseModel):
    question: str
    extra_chunks: Optional[List[Dict[str, str]]] = None


class TransliterateRequest(BaseModel):
    text: str


class SummarizeRequest(BaseModel):
    text: str
    max_sentences: Optional[int] = 4


class DemandRequest(BaseModel):
    postings: List[Dict[str, Any]]
    k: Optional[int] = 4


class ResearchRequest(BaseModel):
    text: str


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
] + AYUSH_SKILLS


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
async def extract_resume_skills(file: UploadFile = File(...), use_semantic: bool = True, confidence_threshold: float = 0.65):
    """
    Parse resume and extract normalized skills using NLP embeddings
    Requirements: 14.1, 14.2, 14.3, 9.1, 9.3
    Property 11: Normalization idempotence
    
    Args:
        file: Resume file (PDF, DOCX, or TXT)
        use_semantic: Use semantic matching (default: True)
        confidence_threshold: Minimum confidence for semantic matches (default: 0.65)
    """
    content = await file.read()
    try:
        text = read_upload_bytes(file.filename or "", content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    result_data = analyze_resume(text, use_semantic=use_semantic, threshold=confidence_threshold)
    return ApiResponse(
        success=True,
        message="Skills extracted successfully",
        data=result_data,
    )


@app.post("/ai/semantic-skill-match")
async def semantic_skill_match(request: SemanticSkillMatchRequest):
    """
    Find similar skills using semantic embeddings.
    Handles typos, abbreviations, and variations.
    
    Example: "reactjs" matches "React", "React.js", "React Native"
    """
    try:
        embedding_service = get_embedding_service()
        matches = embedding_service.find_similar_skills(
            query_skill=request.query_skill,
            skill_list=request.candidate_skills,
            threshold=request.threshold or 0.7,
            top_k=request.top_k or 5
        )
        
        return ApiResponse(
            success=True,
            message=f"Found {len(matches)} similar skills",
            data={
                "query": request.query_skill,
                "matches": [{"skill": skill, "similarity": score} for skill, score in matches]
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic matching failed: {str(e)}")


@app.post("/ai/skill-relationships")
async def get_skill_relationships(request: SkillRelationshipRequest):
    """
    Find related skills for skill gap recommendations.
    Helps students discover complementary skills to learn.
    
    Example: "React" → ["JavaScript", "TypeScript", "Node.js", "Redux", "Next.js"]
    """
    try:
        embedding_service = get_embedding_service()
        related = embedding_service.get_skill_relationships(
            skill=request.skill,
            all_skills=request.all_skills,
            top_k=request.top_k or 5
        )
        
        return ApiResponse(
            success=True,
            message=f"Found {len(related)} related skills",
            data={
                "skill": request.skill,
                "related_skills": [{"skill": skill, "similarity": score} for skill, score in related]
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Relationship extraction failed: {str(e)}")


@app.post("/ai/semantic-profile-match")
async def semantic_profile_match(request: StudentProfileMatchRequest):
    """
    Match student profile to opportunities using semantic similarity.
    More intelligent than keyword matching - understands context.
    
    Args:
        student_profile: Text description of student (skills, interests, projects)
        opportunity_descriptions: List of opportunity descriptions with IDs
        top_k: Number of top matches to return
    """
    try:
        embedding_service = get_embedding_service()
        
        # Extract descriptions and IDs
        opp_texts = [opp["description"] for opp in request.opportunity_descriptions]
        opp_ids = [opp["id"] for opp in request.opportunity_descriptions]
        
        # Get semantic matches
        matches = embedding_service.match_student_to_opportunities(
            student_profile=request.student_profile,
            opportunity_descriptions=opp_texts,
            top_k=request.top_k or 10
        )
        
        # Map back to opportunity IDs
        results = [
            {
                "opportunity_id": opp_ids[idx],
                "similarity": score,
                "rank": rank + 1
            }
            for rank, (idx, score) in enumerate(matches)
        ]
        
        return ApiResponse(
            success=True,
            message=f"Found {len(results)} semantic matches",
            data={"matches": results}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile matching failed: {str(e)}")


@app.post("/ai/compute-similarity")
async def compute_text_similarity(text1: str, text2: str):
    """
    Compute semantic similarity between two texts.
    Returns a score between 0 (completely different) and 1 (identical meaning).
    """
    try:
        embedding_service = get_embedding_service()
        similarity = embedding_service.compute_similarity(text1, text2)
        
        return ApiResponse(
            success=True,
            message="Similarity computed",
            data={
                "text1": text1[:100],  # First 100 chars
                "text2": text2[:100],
                "similarity": similarity,
                "interpretation": (
                    "very high" if similarity > 0.9 else
                    "high" if similarity > 0.75 else
                    "moderate" if similarity > 0.5 else
                    "low" if similarity > 0.25 else
                    "very low"
                )
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Similarity computation failed: {str(e)}")


@app.post("/ai/explain-match")
async def explain_match_endpoint(request: ExplainMatchRequest):
    data = explain_match(request.student_skills, request.required_skills, request.title or "")
    return ApiResponse(success=True, message="Match explained", data=data)


@app.post("/ai/rank-applicants")
async def rank_applicants_endpoint(request: RankApplicantsRequest):
    ranked = rank_applicants(request.posting, request.applicants)
    return ApiResponse(success=True, message="Applicants ranked", data={"applicants": ranked})


@app.post("/ai/score-written")
async def score_written_endpoint(request: WrittenScoreRequest):
    data = score_written_answer(request.student_answer, request.model_answer, request.keywords)
    return ApiResponse(success=True, message="Written answer scored", data=data)


@app.post("/ai/assessment-flags")
async def assessment_flags_endpoint(request: AssessmentFlagRequest):
    data = flag_inconsistent_assessment(request.answers)
    return ApiResponse(success=True, message="Assessment flags computed", data=data)


@app.post("/ai/draft-mcq")
async def draft_mcq_endpoint(request: McqDraftRequest):
    items = generate_mcq_stub(request.subject, request.source_note)
    return ApiResponse(success=True, message="Draft items — faculty review required", data={"items": items})


@app.post("/ai/chat")
async def chat_endpoint(request: ChatRequest):
    data = rag_answer(request.question, request.extra_chunks)
    return ApiResponse(success=True, message="Answered", data=data)


@app.post("/ai/transliterate")
async def transliterate_endpoint(request: TransliterateRequest):
    data = transliterate_terms(request.text)
    return ApiResponse(success=True, message="Terms mapped", data=data)


@app.post("/ai/summarize")
async def summarize_endpoint(request: SummarizeRequest):
    data = summarize_text(request.text, request.max_sentences or 4)
    return ApiResponse(success=True, message="Summary ready", data=data)


@app.post("/ai/extract-certificate-skills")
async def extract_certificate_skills(file: UploadFile = File(...)):
    content = await file.read()
    text = read_upload_bytes(file.filename or "", content)
    data = analyze_resume(text, use_semantic=True, threshold=0.6)
    data["document_type"] = "certificate"
    return ApiResponse(success=True, message="Certificate skills extracted", data=data)


@app.post("/ai/skill-demand")
async def skill_demand_endpoint(request: DemandRequest):
    data = cluster_skill_demand(request.postings, request.k or 4)
    return ApiResponse(success=True, message="Demand clustered", data=data)


@app.post("/ai/classify-research")
async def classify_research_endpoint(request: ResearchRequest):
    data = classify_research(request.text)
    return ApiResponse(success=True, message="Classified", data=data)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
