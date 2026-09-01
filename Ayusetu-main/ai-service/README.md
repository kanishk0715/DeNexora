# AI Service

Python + FastAPI microservice for machine learning operations in the Academia-Industry Collaboration Portal.

## Features

- **FastAPI** high-performance API framework
- **MongoDB** integration (pymongo)
- **Machine Learning**: spaCy, scikit-learn
- **NLP Embeddings**: sentence-transformers for semantic skill matching
- **Testing**: pytest + Hypothesis (property-based testing)
- **Resume Parsing**: PyPDF2, python-docx with semantic extraction

## Structure

```
ai-service/
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
└── pytest.ini          # Pytest configuration
```

## Getting Started

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Download models** (optional - will auto-download on first use)
   ```bash
   # spaCy model (if using NLP features)
   python -m spacy download en_core_web_sm
   
   # Sentence transformer model (for embeddings)
   python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run development server**
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

5. **Run tests**
   ```bash
   pytest
   ```

## Endpoints

### Core ML Endpoints
- `POST /ai/analyze-skills` - Compute skill profile and gaps from assessment
- `POST /ai/recommendations` - Generate ranked opportunity recommendations
- `POST /ai/extract-resume-skills` - Extract and normalize skills from resume (with semantic extraction)
- `POST /ai/match-score` - Calculate match score between student and opportunity

### Semantic/Embedding Endpoints
- `POST /ai/semantic-skill-match` - Find similar skills using embeddings (fuzzy matching)
- `POST /ai/skill-relationships` - Discover related skills for gap recommendations
- `POST /ai/semantic-profile-match` - Match student profiles to opportunities semantically
- `POST /ai/compute-similarity` - Compute semantic similarity between two texts

### Health
- `GET /` - Service information
- `GET /health` - Health check

See [NLP_EMBEDDINGS_GUIDE.md](./NLP_EMBEDDINGS_GUIDE.md) for detailed embedding documentation.

## API Response Format

Matches backend envelope structure:

```python
{
  "success": bool,
  "message": str,
  "data": dict | None,
  "errors": list | None
}
```

## Testing

- **Unit tests**: `pytest tests/`
- **Property-based tests**: Uses Hypothesis for property testing
- **Coverage**: `pytest --cov=.`

## Environment Variables

See `.env.example` for required configuration.

## Port

Default: **8000**

## Python Version

Requires: **Python 3.11+**
