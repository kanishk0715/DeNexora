"""Canonical AYUSH skills, aliases, evidence cues, FAQ, and transliteration."""

from __future__ import annotations

CANONICAL_SKILLS = [
    "Panchakarma protocols",
    "Kayachikitsa",
    "Shalya Tantra",
    "Shalakya Tantra",
    "Prasuti Tantra & Stri Roga",
    "Kaumarabhritya",
    "Dravyaguna",
    "Rasashastra & Bhaishajya Kalpana",
    "Swasthavritta",
    "Agada Tantra",
    "Nadi Pariksha",
    "Yoga therapy",
    "Abhyanga",
    "Clinical documentation",
    "Patient counselling",
    "Unani pharmacy",
    "GMP documentation",
    "Case taking",
    "Repertory",
    "Siddha diagnostics",
    "Herbal pharmacology",
    "Guest relations",
    "Basti",
    "Vamana",
    "Virechana",
    "Nasya",
    "Raktamokshana",
    "Ksharsutra",
    "Sanskrit medical terminology",
]

SKILL_ALIASES = {
    "panchakarma": "Panchakarma protocols",
    "pancha karma": "Panchakarma protocols",
    "pk protocols": "Panchakarma protocols",
    "panchakarma theatre": "Panchakarma protocols",
    "kayachikitsa": "Kayachikitsa",
    "kaya chikitsa": "Kayachikitsa",
    "internal medicine ayurveda": "Kayachikitsa",
    "shalya": "Shalya Tantra",
    "shalya tantra": "Shalya Tantra",
    "ksharsutra": "Ksharsutra",
    "kshara sutra": "Ksharsutra",
    "shalakya": "Shalakya Tantra",
    "shalakya tantra": "Shalakya Tantra",
    "prasuti": "Prasuti Tantra & Stri Roga",
    "stri roga": "Prasuti Tantra & Stri Roga",
    "kaumarabhritya": "Kaumarabhritya",
    "kaumara bhritya": "Kaumarabhritya",
    "balroga": "Kaumarabhritya",
    "dravyaguna": "Dravyaguna",
    "dravya guna": "Dravyaguna",
    "rasashastra": "Rasashastra & Bhaishajya Kalpana",
    "bhaishajya kalpana": "Rasashastra & Bhaishajya Kalpana",
    "swasthavritta": "Swasthavritta",
    "swastha vritta": "Swasthavritta",
    "agada tantra": "Agada Tantra",
    "agadatantra": "Agada Tantra",
    "nadi pariksha": "Nadi Pariksha",
    "nadi pariksha": "Nadi Pariksha",
    "nadi": "Nadi Pariksha",
    "pulse diagnosis": "Nadi Pariksha",
    "yoga therapy": "Yoga therapy",
    "yogic therapy": "Yoga therapy",
    "abhyanga": "Abhyanga",
    "clinical documentation": "Clinical documentation",
    "case sheet": "Clinical documentation",
    "opd notes": "Clinical documentation",
    "patient counselling": "Patient counselling",
    "counseling": "Patient counselling",
    "unani pharmacy": "Unani pharmacy",
    "gmp": "GMP documentation",
    "batch record": "GMP documentation",
    "case taking": "Case taking",
    "repertory": "Repertory",
    "repertorisation": "Repertory",
    "siddha": "Siddha diagnostics",
    "envagai thervu": "Siddha diagnostics",
    "herbal pharmacology": "Herbal pharmacology",
    "guest relations": "Guest relations",
    "basti": "Basti",
    "vamana": "Vamana",
    "virechana": "Virechana",
    "nasya": "Nasya",
    "raktamokshana": "Raktamokshana",
    "raktamokshan": "Raktamokshana",
    "sanskrit": "Sanskrit medical terminology",
}

RELATED_SKILLS = {
    "Panchakarma protocols": ["Basti", "Vamana", "Virechana", "Nasya", "Abhyanga", "Clinical documentation"],
    "Kayachikitsa": ["Nadi Pariksha", "Dravyaguna", "Patient counselling", "Clinical documentation"],
    "Dravyaguna": ["Herbal pharmacology", "Rasashastra & Bhaishajya Kalpana", "Agada Tantra"],
    "Yoga therapy": ["Swasthavritta", "Patient counselling"],
    "Clinical documentation": ["Case taking", "GMP documentation", "Patient counselling"],
    "Shalya Tantra": ["Ksharsutra", "Clinical documentation"],
}

EVIDENCE_CUES = (
    "assisted", "performed", "hours", "theatre", "opd", "ipd", "intern", "rotation",
    "supervised", "case log", "documented", "ccras", "posted at", "clinical exposure",
    "hands-on", "observed", "assisted in",
)

DECLARED_CUES = (
    "familiar with", "knowledge of", "interested in", "coursework", "studied",
    "aware of", "introduction to",
)

TRANSLITERATION = {
    "nadi pariksha": "Nāḍī Parīkṣā",
    "panchakarma": "Pañcakarma",
    "kayachikitsa": "Kāyacikitsā",
    "dravyaguna": "Dravyaguṇa",
    "swasthavritta": "Svasthavṛtta",
    "abhyanga": "Abhyaṅga",
    "basti": "Basti",
    "vamana": "Vamana",
    "virechana": "Virecana",
    "nasya": "Nasya",
    "shalya tantra": "Śalya Tantra",
    "shalakya tantra": "Śālākya Tantra",
    "kaumarabhritya": "Kaumārabhṛtya",
    "agada tantra": "Agada Tantra",
}

FAQ_CHUNKS = [
    {
        "id": "bams",
        "title": "BAMS",
        "text": "BAMS (Bachelor of Ayurvedic Medicine and Surgery) is a 5.5-year degree including internship. Students learn Ayurvedic medicine, surgery, and modern medical sciences. After BAMS you may pursue MD Ayurveda or clinical practice.",
    },
    {
        "id": "internships",
        "title": "Internships",
        "text": "AyuSetu internships include Panchakarma, Kayachikitsa, Shalya, and specialty departments at AIIA, NIA, MDNIY, state hospitals, and wellness centres. Match scores use verified skills and clinical hours.",
    },
    {
        "id": "panchakarma",
        "title": "Panchakarma",
        "text": "Panchakarma is detoxification therapy: Vamana, Virechana, Basti, Nasya, and Raktamokshana. Hospitals hire therapists with documented theatre hours and case sheets.",
    },
    {
        "id": "assessment",
        "title": "Skill assessment",
        "text": "The BAMS subject assessment scores Kayachikitsa, Panchakarma and other subjects. Gaps drive internship ranking. Resume NLP maps CV phrases onto the same ontology.",
    },
    {
        "id": "career",
        "title": "Careers",
        "text": "AYUSH careers include government hospitals, private clinics, wellness centres, pharmacies, CCRAS research, and teaching. Specialized Panchakarma or Ksharsutra skills raise match scores.",
    },
    {
        "id": "ministry",
        "title": "Ministry of Ayush",
        "text": "Ministry of Ayush promotes education, research, and practice. National institutes, scholarships, and skill-bridge dashboards sit on AyuSetu for ministry users.",
    },
    {
        "id": "dpdp",
        "title": "Consent",
        "text": "Self-declared skills stay private until an institution verifies them. Sharing a profile with a hospital requires explicit DPDP consent on the internship apply step.",
    },
]

RESEARCH_LABELS = [
    "clinical trial",
    "drug development",
    "public health",
    "education pedagogy",
    "classical literature",
    "pharmacognosy",
]


def normalize_skill(raw: str) -> str:
    clean = " ".join(raw.strip().lower().split())
    if clean in SKILL_ALIASES:
        return SKILL_ALIASES[clean]
    for alias, canonical in SKILL_ALIASES.items():
        if alias in clean or clean in alias:
            return canonical
    for skill in CANONICAL_SKILLS:
        if skill.lower() == clean:
            return skill
    return raw.strip()


def all_search_terms() -> list[tuple[str, str]]:
    terms = [(s.lower(), s) for s in CANONICAL_SKILLS]
    terms.extend((a, c) for a, c in SKILL_ALIASES.items())
    return terms
