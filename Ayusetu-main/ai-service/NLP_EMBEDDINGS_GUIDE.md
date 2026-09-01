# NLP Embeddings Guide

## Overview

The AI service now uses **sentence-transformers** to create semantic embeddings for skills and text. This enables intelligent matching that understands meaning, not just exact text matches.

## What Are Embeddings?

Embeddings convert text into numerical vectors (arrays of numbers) that capture semantic meaning. Similar texts have similar vectors.

**Example:**
- "Python" → [0.23, -0.45, 0.67, ...] (384 numbers)
- "Python programming" → [0.21, -0.43, 0.65, ...] (very similar!)
- "Cooking" → [-0.12, 0.78, -0.34, ...] (completely different)

## Benefits

### 1. **Fuzzy Skill Matching**
Handles typos, abbreviations, and variations:
- "reactjs" → matches "React"
- "JS" → matches "JavaScript"
- "ML" → matches "Machine Learning"

### 2. **Context-Aware Resume Parsing**
Understands skills from context:
- "Built web apps with React" → extracts "React"
- "3 years of ML experience" → extracts "Machine Learning"

### 3. **Semantic Recommendations**
Matches based on meaning, not keywords:
- Student: "Python backend developer"
- Opportunity: "Server-side programming with Django"
- Result: High match (even though no exact keyword overlap)

### 4. **Skill Relationships**
Discovers related skills:
- "React" → ["JavaScript", "TypeScript", "Node.js", "Redux"]
- Useful for skill gap recommendations

## Architecture

```
┌─────────────────────────────────────────┐
│         embedding_service.py            │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  SentenceTransformer Model        │ │
│  │  (all-MiniLM-L6-v2)              │ │
│  │  - 384-dimensional embeddings     │ │
│  │  - 80MB model size                │ │
│  │  - Fast inference (~50ms)         │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Embedding Cache                  │ │
│  │  (in-memory)                      │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│              main.py                    │
│                                         │
│  • /ai/extract-resume-skills           │
│  • /ai/semantic-skill-match            │
│  • /ai/skill-relationships             │
│  • /ai/semantic-profile-match          │
│  • /ai/compute-similarity              │
└─────────────────────────────────────────┘
```

## New API Endpoints

### 1. Enhanced Resume Parsing

**Endpoint:** `POST /ai/extract-resume-skills`

**Parameters:**
- `file`: Resume file (PDF, DOCX, TXT)
- `use_semantic`: Enable semantic extraction (default: true)
- `confidence_threshold`: Minimum confidence (default: 0.65)

**Response:**
```json
{
  "success": true,
  "message": "Skills extracted successfully",
  "data": {
    "extracted_skills": ["Python", "JavaScript", "React", "Machine Learning"],
    "count": 4,
    "method": "semantic+keyword",
    "semantic_details": [
      {
        "skill": "Python",
        "confidence": 0.92,
        "context": "3 years of experience in Python programming..."
      }
    ],
    "keyword_only": ["Python", "React"],
    "semantic_only": ["JavaScript", "Machine Learning"]
  }
}
```

### 2. Semantic Skill Matching

**Endpoint:** `POST /ai/semantic-skill-match`

**Request:**
```json
{
  "query_skill": "reactjs",
  "candidate_skills": ["React", "JavaScript", "Angular", "Vue.js"],
  "threshold": 0.7,
  "top_k": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Found 2 similar skills",
  "data": {
    "query": "reactjs",
    "matches": [
      {"skill": "React", "similarity": 0.95},
      {"skill": "JavaScript", "similarity": 0.78}
    ]
  }
}
```

### 3. Skill Relationships

**Endpoint:** `POST /ai/skill-relationships`

**Request:**
```json
{
  "skill": "Python",
  "all_skills": ["JavaScript", "Django", "Flask", "React", "Machine Learning"],
  "top_k": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Found 3 related skills",
  "data": {
    "skill": "Python",
    "related_skills": [
      {"skill": "Machine Learning", "similarity": 0.82},
      {"skill": "Django", "similarity": 0.78},
      {"skill": "Flask", "similarity": 0.76}
    ]
  }
}
```

### 4. Student-Opportunity Matching

**Endpoint:** `POST /ai/semantic-profile-match`

**Request:**
```json
{
  "student_profile": "Python developer with 3 years ML experience",
  "opportunity_descriptions": [
    {"id": "1", "description": "Machine learning engineer with Python"},
    {"id": "2", "description": "Frontend React developer"},
    {"id": "3", "description": "Data scientist"}
  ],
  "top_k": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Found 2 semantic matches",
  "data": {
    "matches": [
      {"opportunity_id": "1", "similarity": 0.89, "rank": 1},
      {"opportunity_id": "3", "similarity": 0.81, "rank": 2}
    ]
  }
}
```

### 5. Text Similarity

**Endpoint:** `POST /ai/compute-similarity`

**Query Parameters:**
- `text1`: First text
- `text2`: Second text

**Response:**
```json
{
  "success": true,
  "message": "Similarity computed",
  "data": {
    "text1": "Machine Learning",
    "text2": "Deep Learning",
    "similarity": 0.78,
    "interpretation": "high"
  }
}
```

## Usage in Code

### Python (AI Service)

```python
from embedding_service import get_embedding_service

# Get the global instance
embedding_service = get_embedding_service()

# Get embedding for text
embedding = embedding_service.get_embedding("Python programming")

# Compute similarity
similarity = embedding_service.compute_similarity("React", "React.js")

# Find similar skills
matches = embedding_service.find_similar_skills(
    query_skill="ML",
    skill_list=["Machine Learning", "Deep Learning", "AI"],
    threshold=0.7
)

# Extract skills from resume
skills = embedding_service.extract_skills_semantic(
    text=resume_text,
    known_skills=KNOWN_SKILLS,
    threshold=0.65
)
```

### JavaScript (Frontend/Backend)

```javascript
// Enhanced resume upload
const formData = new FormData();
formData.append('file', resumeFile);

const response = await fetch('/ai/extract-resume-skills?use_semantic=true', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data.extracted_skills);

// Fuzzy skill matching
const matchResponse = await fetch('/ai/semantic-skill-match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query_skill: "reactjs",
    candidate_skills: ["React", "Angular", "Vue.js"],
    threshold: 0.7
  })
});
```

## Performance Considerations

### Model Loading
- First request loads model (~2-3 seconds)
- Subsequent requests are fast (~50ms per embedding)
- Model stays in memory during service lifetime

### Caching
- Embeddings are cached in memory
- Repeated text gets cached result
- Call `clear_cache()` if memory concerns

### Batch Processing
```python
# Efficient: Batch processing
embeddings = embedding_service.get_embeddings_batch(["skill1", "skill2", "skill3"])

# Inefficient: Individual calls
emb1 = embedding_service.get_embedding("skill1")
emb2 = embedding_service.get_embedding("skill2")
emb3 = embedding_service.get_embedding("skill3")
```

## Model Information

**Model:** `all-MiniLM-L6-v2`
- **Provider:** sentence-transformers (Hugging Face)
- **Dimensions:** 384
- **Size:** 80MB
- **Speed:** ~50ms per embedding
- **Language:** English (primary), multi-lingual support
- **License:** Apache 2.0

**Why This Model?**
- Lightweight and fast
- Good balance of speed and quality
- Works on CPU (no GPU required)
- Well-tested and widely used

## Thresholds Guide

Similarity scores range from 0.0 (completely different) to 1.0 (identical).

| Score Range | Interpretation | Use Case |
|-------------|----------------|----------|
| 0.90 - 1.00 | Very High | Exact matches, typos |
| 0.75 - 0.89 | High | Related skills, variations |
| 0.60 - 0.74 | Moderate | Somewhat related |
| 0.40 - 0.59 | Low | Different but in same domain |
| 0.00 - 0.39 | Very Low | Unrelated |

**Recommended Thresholds:**
- **Fuzzy matching:** 0.75+
- **Resume extraction:** 0.65+
- **Related skills:** 0.50+
- **Opportunity matching:** 0.60+

## Error Handling

The service includes graceful fallbacks:

```python
# If semantic extraction fails, falls back to keyword matching
try:
    semantic_results = embedding_service.extract_skills_semantic(...)
except Exception as e:
    # Fallback to keyword-only
    keyword_results = extract_skills_from_text(...)
```

## Testing

Run tests with:
```bash
pytest tests/test_embedding_service.py -v
```

**Test Coverage:**
- ✅ Embedding generation
- ✅ Caching behavior
- ✅ Similarity computation
- ✅ Skill matching
- ✅ Semantic extraction
- ✅ Batch processing
- ✅ Property-based tests (with Hypothesis)

## Future Enhancements

### Potential Improvements:
1. **Multi-lingual support** - Support for Indian languages
2. **Domain-specific models** - Fine-tuned for Ayurveda/medical terms
3. **Skill taxonomy** - Hierarchical skill relationships
4. **Real-time updates** - Dynamic skill database
5. **GPU acceleration** - Faster inference for large batches
6. **Vector database** - Persistent embedding storage (Pinecone, Weaviate)

## Troubleshooting

### Model Download Issues
If the model doesn't download automatically:
```bash
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

### Memory Issues
If running out of memory:
```python
# Clear cache periodically
embedding_service.clear_cache()

# Use smaller batches
embeddings = embedding_service.get_embeddings_batch(texts[:100])
```

### Slow First Request
The first request loads the model. This is normal. Consider:
- Preload model at service startup
- Use a health check endpoint to warm up

## References

- [Sentence Transformers Documentation](https://www.sbert.net/)
- [all-MiniLM-L6-v2 Model Card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [Semantic Search Guide](https://www.sbert.net/examples/applications/semantic-search/README.html)

---

**Status:** ✅ Fully implemented and tested
**Version:** 1.0.0
**Last Updated:** 2026-09-01
