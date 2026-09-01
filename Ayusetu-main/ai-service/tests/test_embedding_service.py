"""
Tests for the embedding service
"""

import pytest
from embedding_service import EmbeddingService, get_embedding_service
import numpy as np


@pytest.fixture
def embedding_service():
    """Fixture to create a fresh embedding service for each test."""
    return EmbeddingService()


def test_get_embedding(embedding_service):
    """Test basic embedding generation."""
    text = "Python programming"
    embedding = embedding_service.get_embedding(text)
    
    assert isinstance(embedding, np.ndarray)
    assert embedding.shape[0] == 384  # all-MiniLM-L6-v2 produces 384-dim embeddings
    assert not np.isnan(embedding).any()


def test_embedding_cache(embedding_service):
    """Test that embeddings are cached correctly."""
    text = "JavaScript development"
    
    # First call should compute
    emb1 = embedding_service.get_embedding(text)
    
    # Second call should use cache
    emb2 = embedding_service.get_embedding(text)
    
    # Should be identical (same object in cache)
    assert np.array_equal(emb1, emb2)
    assert text in embedding_service.embedding_cache


def test_compute_similarity(embedding_service):
    """Test semantic similarity computation."""
    # Similar texts
    sim_high = embedding_service.compute_similarity("Python", "Python programming")
    assert 0.5 < sim_high <= 1.0
    
    # Related but different
    sim_medium = embedding_service.compute_similarity("Python", "JavaScript")
    assert 0.3 < sim_medium < 0.8
    
    # Unrelated texts
    sim_low = embedding_service.compute_similarity("Python", "cooking recipes")
    assert 0.0 <= sim_low < 0.5


def test_find_similar_skills(embedding_service):
    """Test finding similar skills from a list."""
    skills = ["Python", "JavaScript", "Java", "React", "Machine Learning", "Data Science"]
    
    # Find skills similar to "ML"
    results = embedding_service.find_similar_skills(
        query_skill="ML",
        skill_list=skills,
        threshold=0.6,
        top_k=3
    )
    
    assert len(results) <= 3
    assert all(isinstance(r, tuple) for r in results)
    assert all(len(r) == 2 for r in results)
    
    # Check that scores are in descending order
    scores = [score for _, score in results]
    assert scores == sorted(scores, reverse=True)
    
    # Machine Learning should be in results
    skill_names = [skill for skill, _ in results]
    assert "Machine Learning" in skill_names or "Data Science" in skill_names


def test_extract_skills_semantic(embedding_service):
    """Test semantic skill extraction from text."""
    text = """
    I have 3 years of experience in Python programming and machine learning.
    Built several web applications using React and Node.js.
    Proficient in data analysis with pandas and numpy.
    """
    
    known_skills = ["Python", "Machine Learning", "React", "Node.js", "Data Science"]
    
    results = embedding_service.extract_skills_semantic(
        text=text,
        known_skills=known_skills,
        threshold=0.6
    )
    
    assert isinstance(results, list)
    assert len(results) > 0
    
    for result in results:
        assert "skill" in result
        assert "confidence" in result
        assert "context" in result
        assert 0.0 <= result["confidence"] <= 1.0


def test_fuzzy_skill_match(embedding_service):
    """Test fuzzy matching for skill variations."""
    candidates = ["React", "JavaScript", "Python", "Machine Learning"]
    
    # Test abbreviation
    match = embedding_service.fuzzy_skill_match("JS", candidates, threshold=0.7)
    assert match in ["JavaScript", None]  # Should match JavaScript or None if threshold too high
    
    # Test typo
    match = embedding_service.fuzzy_skill_match("Reactjs", candidates, threshold=0.7)
    assert match == "React"
    
    # Test no match
    match = embedding_service.fuzzy_skill_match("Cooking", candidates, threshold=0.7)
    assert match is None


def test_get_skill_relationships(embedding_service):
    """Test finding related skills."""
    all_skills = [
        "Python", "JavaScript", "React", "Node.js", "Django", "Flask",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"
    ]
    
    # Find skills related to Python
    related = embedding_service.get_skill_relationships(
        skill="Python",
        all_skills=all_skills,
        top_k=3
    )
    
    assert len(related) <= 3
    
    # Python itself should not be in results
    skill_names = [skill for skill, _ in related]
    assert "Python" not in skill_names
    
    # Should include Python-related frameworks
    assert any(s in skill_names for s in ["Django", "Flask", "Machine Learning"])


def test_match_student_to_opportunities(embedding_service):
    """Test student-opportunity matching."""
    student_profile = "Experienced Python developer with machine learning background"
    
    opportunities = [
        "Python developer needed for ML project",
        "Frontend React developer",
        "Java backend engineer",
        "Data scientist with Python skills"
    ]
    
    matches = embedding_service.match_student_to_opportunities(
        student_profile=student_profile,
        opportunity_descriptions=opportunities,
        top_k=2
    )
    
    assert len(matches) == 2
    
    # Check structure
    for idx, score in matches:
        assert isinstance(idx, int)
        assert 0 <= idx < len(opportunities)
        assert 0.0 <= score <= 1.0
    
    # Best match should be ML or Data Science related
    best_match_idx = matches[0][0]
    assert "ML" in opportunities[best_match_idx] or "Python" in opportunities[best_match_idx]


def test_clear_cache(embedding_service):
    """Test cache clearing."""
    # Add some embeddings
    embedding_service.get_embedding("test1")
    embedding_service.get_embedding("test2")
    
    assert len(embedding_service.embedding_cache) > 0
    
    # Clear cache
    embedding_service.clear_cache()
    
    assert len(embedding_service.embedding_cache) == 0
    assert len(embedding_service.skill_embeddings) == 0


def test_get_embeddings_batch(embedding_service):
    """Test batch embedding generation."""
    texts = ["Python", "JavaScript", "Java"]
    embeddings = embedding_service.get_embeddings_batch(texts)
    
    assert embeddings.shape == (3, 384)
    assert not np.isnan(embeddings).any()


def test_global_instance():
    """Test singleton pattern for global embedding service."""
    service1 = get_embedding_service()
    service2 = get_embedding_service()
    
    # Should be the same instance
    assert service1 is service2


def test_similarity_properties(embedding_service):
    """Test properties of similarity metric."""
    text1 = "Machine Learning"
    text2 = "Deep Learning"
    text3 = "Cooking"
    
    # Symmetry: sim(A, B) == sim(B, A)
    sim_ab = embedding_service.compute_similarity(text1, text2)
    sim_ba = embedding_service.compute_similarity(text2, text1)
    assert abs(sim_ab - sim_ba) < 0.001
    
    # Self-similarity should be ~1.0
    sim_aa = embedding_service.compute_similarity(text1, text1)
    assert 0.99 <= sim_aa <= 1.0
    
    # Related concepts should have higher similarity than unrelated
    sim_related = embedding_service.compute_similarity(text1, text2)
    sim_unrelated = embedding_service.compute_similarity(text1, text3)
    assert sim_related > sim_unrelated


# Property-based tests using Hypothesis (optional)
try:
    from hypothesis import given, strategies as st
    
    @given(st.text(min_size=1, max_size=100))
    def test_embedding_always_returns_valid_shape(text):
        """Property: Embedding should always return correct shape."""
        service = get_embedding_service()
        embedding = service.get_embedding(text)
        assert embedding.shape[0] == 384
        assert not np.isnan(embedding).any()
    
    @given(st.text(min_size=1), st.text(min_size=1))
    def test_similarity_is_symmetric(text1, text2):
        """Property: Similarity should be symmetric."""
        service = get_embedding_service()
        sim1 = service.compute_similarity(text1, text2)
        sim2 = service.compute_similarity(text2, text1)
        assert abs(sim1 - sim2) < 0.01

except ImportError:
    # Hypothesis not available, skip property tests
    pass
