from nlp_pipeline import keyword_skills, explain_match, flag_inconsistent_assessment
from ayush_ontology import normalize_skill


def test_panchakarma_alias():
    assert normalize_skill("pancha karma") == "Panchakarma protocols"
    text = "Assisted in Panchakarma theatre and Nadi Pariksha OPD for 120 hours."
    skills = keyword_skills(text)
    assert "Panchakarma protocols" in skills
    assert "Nadi Pariksha" in skills


def test_explain_match_sentence():
    student = [{"name": "Panchakarma protocols", "score": 80}, {"name": "Nadi Pariksha", "score": 50}]
    required = [
        {"name": "Panchakarma protocols", "required_score": 75},
        {"name": "Clinical documentation", "required_score": 65},
    ]
    out = explain_match(student, required, "AIIA intern")
    assert out["matched"]
    assert out["missing"]
    assert "Strong on" in out["explanation"]


def test_guess_flag():
    answers = [{"selected_option": 0, "correct_answer": 1, "skill_name": "Panchakarma"} for _ in range(8)]
    flags = flag_inconsistent_assessment(answers)
    assert flags["guess_risk"] in ("medium", "high")
    assert flags["flags"]
