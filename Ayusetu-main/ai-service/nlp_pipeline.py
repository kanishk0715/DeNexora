"""AYUSH-focused NLP: resume, matching, RAG, scoring, demand clusters."""

from __future__ import annotations

import io
import re
from collections import Counter
from typing import Any, Dict, List, Optional

from ayush_ontology import (
    CANONICAL_SKILLS,
    EVIDENCE_CUES,
    DECLARED_CUES,
    FAQ_CHUNKS,
    RELATED_SKILLS,
    RESEARCH_LABELS,
    TRANSLITERATION,
    all_search_terms,
    normalize_skill,
)
from embedding_service import get_embedding_service, _cosine

EDU_RE = re.compile(
    r"\b(bams|bums|bhms|bsms|bnys|md\s*ayurveda|md\/ms)\b",
    re.I,
)
YEAR_RE = re.compile(r"\b(20\d{2}|final[- ]year|intern(?:ship)?)\b", re.I)
HOURS_RE = re.compile(r"(\d{2,4})\s*(?:clinical\s*)?hours", re.I)
LOC_RE = re.compile(
    r"\b(new delhi|delhi|jaipur|hyderabad|kolkata|chennai|kochi|bengaluru|lucknow|pune|mumbai)\b",
    re.I,
)


def read_upload_bytes(filename: str, content: bytes) -> str:
    name = (filename or "").lower()
    if name.endswith(".pdf"):
        try:
            import PyPDF2

            reader = PyPDF2.PdfReader(io.BytesIO(content))
            return " ".join(page.extract_text() or "" for page in reader.pages)
        except Exception:
            return content.decode("utf-8", errors="ignore")
    if name.endswith(".docx"):
        try:
            import docx

            doc = docx.Document(io.BytesIO(content))
            return " ".join(p.text for p in doc.paragraphs)
        except Exception:
            return content.decode("utf-8", errors="ignore")
    return content.decode("utf-8", errors="ignore")


def keyword_skills(text: str) -> List[str]:
    found = set()
    lower = text.lower()
    for alias, canonical in all_search_terms():
        if alias in lower:
            found.add(canonical)
    return sorted(found)


def _evidence_level(context: str) -> str:
    c = context.lower()
    if any(cue in c for cue in EVIDENCE_CUES):
        return "evidenced"
    if any(cue in c for cue in DECLARED_CUES):
        return "self-declared"
    return "mentioned"


def analyze_resume(text: str, use_semantic: bool = True, threshold: float = 0.65) -> Dict[str, Any]:
    keyword = keyword_skills(text)
    semantic_details: List[Dict[str, Any]] = []
    method = "keyword"
    if use_semantic:
        try:
            emb = get_embedding_service()
            semantic_details = emb.extract_skills_semantic(text, CANONICAL_SKILLS, threshold)
            method = "semantic+keyword"
        except Exception as e:
            return {
                "extracted_skills": keyword,
                "count": len(keyword),
                "method": "keyword",
                "semantic_error": str(e),
                "fallback": "keyword_only",
            }

    by_name: Dict[str, Dict[str, Any]] = {}
    for s in keyword:
        by_name[s] = {
            "skill": s,
            "confidence": 0.8,
            "context": "",
            "evidence": "mentioned",
        }
    for d in semantic_details:
        skill = normalize_skill(d["skill"])
        prev = by_name.get(skill, {})
        conf = max(float(prev.get("confidence") or 0), float(d["confidence"]))
        ctx = d.get("context") or prev.get("context") or ""
        by_name[skill] = {
            "skill": skill,
            "confidence": round(conf, 3),
            "context": ctx,
            "evidence": _evidence_level(ctx or text[:400]),
        }

    details = sorted(by_name.values(), key=lambda x: x["confidence"], reverse=True)
    skills = [d["skill"] for d in details]
    evidenced = [d["skill"] for d in details if d["evidence"] == "evidenced"]
    declared = [d["skill"] for d in details if d["evidence"] != "evidenced"]

    edu = sorted({m.group(0).upper() if m.group(0).lower().startswith("b") else m.group(0) for m in EDU_RE.finditer(text)})
    hours = HOURS_RE.search(text)
    loc = LOC_RE.search(text)
    years = YEAR_RE.findall(text)

    gaps = []
    for s in skills[:5]:
        for rel in RELATED_SKILLS.get(s, []):
            if rel not in skills:
                gaps.append(rel)
    gaps = list(dict.fromkeys(gaps))[:6]

    summary_bits = []
    if edu:
        summary_bits.append(f"Education signals: {', '.join(edu[:3])}.")
    if hours:
        summary_bits.append(f"Clinical hours mentioned: {hours.group(1)}.")
    if evidenced:
        summary_bits.append(f"Evidenced skills: {', '.join(evidenced[:4])}.")
    if declared:
        summary_bits.append(f"Self-declared / listed: {', '.join(declared[:4])}.")
    if gaps:
        summary_bits.append(f"Likely gaps vs ontology: {', '.join(gaps[:3])}.")
    summary = " ".join(summary_bits) or "No AYUSH skills detected. Add clinical hours and BAMS subjects to the CV."

    return {
        "extracted_skills": skills,
        "count": len(skills),
        "method": method,
        "semantic_details": details,
        "keyword_only": keyword,
        "semantic_only": [s for s in skills if s not in keyword],
        "evidenced_skills": evidenced,
        "self_declared_skills": declared,
        "education": edu,
        "clinical_hours": int(hours.group(1)) if hours else None,
        "location": loc.group(0).title() if loc else None,
        "year_signals": years[:5],
        "skill_summary": summary,
        "suggested_gaps": gaps,
    }


def explain_match(student_skills: List[Dict[str, Any]], required: List[Dict[str, Any]], title: str = "") -> Dict[str, Any]:
    smap = {str(s.get("name", "")).lower(): float(s.get("score", 0)) for s in student_skills}
    matched, missing, weak = [], [], []
    for req in required:
        name = req.get("name") or req.get("skill") or ""
        need = float(req.get("required_score") or req.get("requiredScore") or 70)
        have = smap.get(name.lower(), 0.0)
        if have >= need:
            matched.append({"skill": name, "have": have, "need": need})
        elif have > 0:
            weak.append({"skill": name, "have": have, "need": need, "gap": round(need - have, 1)})
        else:
            missing.append({"skill": name, "need": need})

    parts = []
    if matched:
        parts.append("Strong on " + ", ".join(m["skill"] for m in matched[:3]))
    if weak:
        parts.append("needs more " + ", ".join(w["skill"] for w in weak[:2]))
    if missing:
        parts.append("missing " + ", ".join(m["skill"] for m in missing[:2]))
    explanation = "; ".join(parts) or "No overlapping AYUSH skills yet."
    if title:
        explanation = f"{title}: {explanation}."
    else:
        explanation += "."

    tech = 100.0
    if required:
        scores = []
        for req in required:
            name = (req.get("name") or "").lower()
            need = float(req.get("required_score") or req.get("requiredScore") or 70) or 70
            have = smap.get(name, 0.0)
            scores.append(min(100.0, (have / need) * 100))
        tech = round(sum(scores) / len(scores), 1)

    return {
        "match_score": tech,
        "explanation": explanation,
        "matched": matched,
        "weak": weak,
        "missing": missing,
    }


def rank_applicants(
    posting: Dict[str, Any],
    applicants: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    required = posting.get("required_skills") or posting.get("requiredSkills") or []
    ranked = []
    for a in applicants:
        skills = a.get("skills") or []
        if skills and isinstance(skills[0], str):
            student = [{"name": s, "score": 80 if a.get("verified") else 60} for s in skills]
        else:
            student = skills
        exp = explain_match(student, required, a.get("name") or a.get("id") or "")
        hours = float(a.get("hours") or a.get("clinical_hours") or 0)
        hour_boost = min(8.0, hours / 20)
        score = min(100.0, exp["match_score"] + hour_boost)
        ranked.append(
            {
                **{k: a[k] for k in a if k != "skills"},
                "skills": skills,
                "nlp_match": round(score, 1),
                "explanation": exp["explanation"],
                "missing": exp["missing"],
            }
        )
    ranked.sort(key=lambda x: x["nlp_match"], reverse=True)
    for i, row in enumerate(ranked, 1):
        row["rank"] = i
    return ranked


def score_written_answer(student: str, model_answer: str, keywords: Optional[List[str]] = None) -> Dict[str, Any]:
    emb = get_embedding_service()
    sim = emb.compute_similarity(student or "", model_answer or "")
    kws = keywords or []
    hits = [k for k in kws if k.lower() in (student or "").lower()]
    kw_score = (len(hits) / len(kws)) if kws else sim
    score = round(min(100.0, (0.7 * sim + 0.3 * kw_score) * 100), 1)
    return {
        "score": score,
        "semantic_similarity": round(sim, 3),
        "keyword_hits": hits,
        "feedback": "Close to the model answer." if score >= 70 else "Add classical terms and a clinical example.",
    }


def flag_inconsistent_assessment(answers: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Flag likely guessing: too-fast identical options or mixed related-skill scores."""
    if not answers:
        return {"flags": [], "guess_risk": "low"}
    options = [a.get("selected_option") for a in answers]
    same = options.count(options[0]) == len(options) if options else False
    flags = []
    if same and len(options) >= 6:
        flags.append("Same option selected on every item — possible guessing.")
    by_skill: Dict[str, List[bool]] = {}
    for a in answers:
        name = a.get("skill_name") or a.get("skill_id") or "skill"
        by_skill.setdefault(name, []).append(a.get("selected_option") == a.get("correct_answer"))
    for skill, arr in by_skill.items():
        if len(arr) >= 4 and sum(arr) / len(arr) < 0.3:
            flags.append(f"Weak consistency on {skill}.")
    risk = "high" if len(flags) >= 2 else "medium" if flags else "low"
    return {"flags": flags, "guess_risk": risk}


def generate_mcq_stub(subject: str, source_note: str) -> List[Dict[str, Any]]:
    """Draft MCQs from a note (faculty must review). Uses key sentences."""
    sents = [s.strip() for s in re.split(r"[.\n]+", source_note) if len(s.strip()) > 40][:3]
    items = []
    for i, s in enumerate(sents, 1):
        items.append(
            {
                "skill": subject,
                "text": f"According to the source note, which statement is accurate?",
                "options": [s[:180], "This concept is unrelated to " + subject, "It applies only to modern allopathy", "It is obsolete in NCISM curriculum"],
                "correct": 0,
                "needs_faculty_review": True,
                "source_excerpt": s[:180],
            }
        )
    if not items:
        items.append(
            {
                "skill": subject,
                "text": f"What is a core clinical focus of {subject}?",
                "options": [f"Practice aligned to {subject}", "Unrelated surgical implant design", "Only laboratory chemistry", "Sports physiotherapy exclusively"],
                "correct": 0,
                "needs_faculty_review": True,
            }
        )
    return items


def rag_answer(question: str, extra_chunks: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    emb = get_embedding_service()
    corpus = list(FAQ_CHUNKS) + (extra_chunks or [])
    qe = emb.get_embedding(question)
    scored = []
    for ch in corpus:
        text = ch.get("text") or ""
        scored.append(( _cosine(qe, emb.get_embedding(ch.get("title", "") + " " + text)), ch))
    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[:3]
    if not top or top[0][0] < 0.22:
        return {
            "answer": "I can help with BAMS, internships, Panchakarma, skill assessment, careers, and DPDP consent. Try a more specific AYUSH question.",
            "sources": [],
            "method": "rag-fallback",
        }
    best = top[0][1]
    citations = [{"id": t[1].get("id"), "title": t[1].get("title"), "score": round(t[0], 3)} for t in top if t[0] > 0.2]
    answer = best.get("text") or ""
    if len(top) > 1 and top[1][0] > 0.35:
        answer += " " + (top[1][1].get("text") or "")[:220]
    return {"answer": answer, "sources": citations, "method": "rag"}


def transliterate_terms(text: str) -> Dict[str, Any]:
    found = []
    lower = text.lower()
    for latn, iast in TRANSLITERATION.items():
        if latn in lower:
            found.append({"latin": latn, "iast": iast})
    return {"terms": found, "count": len(found)}


def summarize_text(text: str, max_sentences: int = 4) -> Dict[str, Any]:
    sents = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 30]
    if not sents:
        return {"summary": text[:400], "method": "trim"}
    emb = get_embedding_service()
    query = emb.get_embedding("clinical internship summary outcomes hours skills")
    ranked = sorted(sents, key=lambda s: _cosine(query, emb.get_embedding(s)), reverse=True)
    picked = ranked[:max_sentences]
    return {"summary": " ".join(picked), "sentence_count": len(picked), "method": "extractive"}


def cluster_skill_demand(postings: List[Dict[str, Any]], k: int = 4) -> Dict[str, Any]:
    names: List[str] = []
    for p in postings:
        for s in p.get("required_skills") or p.get("requiredSkills") or []:
            if isinstance(s, dict):
                names.append(s.get("name") or "")
            else:
                names.append(str(s))
    names = [n for n in names if n]
    counts = Counter(names)
    top = [{"skill": n, "postings": c} for n, c in counts.most_common(12)]
    if not names:
        return {"topics": [], "top_skills": []}
    unique = list(dict.fromkeys(names))
    emb = get_embedding_service()
    vecs = emb.get_embeddings_batch(unique)
    try:
        from sklearn.cluster import KMeans

        n_clusters = max(1, min(k, len(unique)))
        km = KMeans(n_clusters=n_clusters, n_init=5, random_state=0)
        labels = km.fit_predict(vecs)
        topics = []
        for i in range(n_clusters):
            members = [unique[j] for j, lab in enumerate(labels) if lab == i]
            topics.append({"topic_id": i, "skills": members[:8]})
    except Exception:
        topics = [{"topic_id": 0, "skills": unique[:8]}]
    return {"topics": topics, "top_skills": top}


def classify_research(text: str) -> Dict[str, Any]:
    emb = get_embedding_service()
    q = emb.get_embedding(text)
    scored = [(lab, emb.compute_similarity(text, lab)) for lab in RESEARCH_LABELS]
    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[0]
    return {
        "label": top[0],
        "confidence": round(top[1], 3),
        "alternatives": [{"label": a, "score": round(s, 3)} for a, s in scored[1:3]],
    }
