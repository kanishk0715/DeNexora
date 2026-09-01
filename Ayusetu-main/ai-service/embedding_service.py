"""
Semantic embeddings with sentence-transformers, plus a lexical fallback
so the API still runs before the MiniLM model is downloaded.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple
import hashlib
import re

import numpy as np

try:
    from sentence_transformers import SentenceTransformer

    EMBEDDING_AVAILABLE = True
except ImportError:
    EMBEDDING_AVAILABLE = False
    SentenceTransformer = None  # type: ignore


def _cosine(a: np.ndarray, b: np.ndarray) -> float:
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))


def _hash_vec(text: str, dim: int = 384) -> np.ndarray:
    vec = np.zeros(dim, dtype=np.float32)
    tokens = re.findall(r"[a-z0-9]+", text.lower())
    grams = tokens + ["".join(tokens[i : i + 2]) for i in range(max(0, len(tokens) - 1))]
    for g in grams:
        h = int(hashlib.md5(g.encode()).hexdigest(), 16)
        vec[h % dim] += 1.0
        vec[(h // dim) % dim] += 0.5
    n = np.linalg.norm(vec)
    return vec / n if n else vec


class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.embedding_cache: Dict[str, np.ndarray] = {}
        self.skill_embeddings: Dict[str, np.ndarray] = {}
        if EMBEDDING_AVAILABLE:
            try:
                self.model = SentenceTransformer(model_name)
            except Exception as e:
                print(f"Error loading embedding model: {e}")

    def _encode(self, texts: List[str]) -> np.ndarray:
        if self.model is not None:
            return np.asarray(self.model.encode(texts, convert_to_numpy=True), dtype=np.float32)
        return np.stack([_hash_vec(t) for t in texts])

    def get_embedding(self, text: str) -> np.ndarray:
        if text in self.embedding_cache:
            return self.embedding_cache[text]
        emb = self._encode([text])[0]
        self.embedding_cache[text] = emb
        return emb

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        arr = self.get_embeddings_batch(texts)
        return arr.tolist()

    def get_embeddings_batch(self, texts: List[str]) -> np.ndarray:
        missing = [t for t in texts if t not in self.embedding_cache]
        if missing:
            encoded = self._encode(missing)
            for t, e in zip(missing, encoded):
                self.embedding_cache[t] = e
        return np.stack([self.embedding_cache[t] for t in texts])

    def compute_similarity(self, text1: str, text2: str) -> float:
        return _cosine(self.get_embedding(text1), self.get_embedding(text2))

    def find_similar_skills(
        self,
        query_skill: str,
        skill_list: List[str],
        threshold: float = 0.7,
        top_k: int = 5,
    ) -> List[Tuple[str, float]]:
        q = self.get_embedding(query_skill)
        scored: List[Tuple[str, float]] = []
        for skill in skill_list:
            sim = _cosine(q, self.get_embedding(skill))
            if sim >= threshold:
                scored.append((skill, round(sim, 4)))
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    def fuzzy_skill_match(
        self, query: str, candidates: List[str], threshold: float = 0.7
    ) -> Optional[str]:
        hits = self.find_similar_skills(query, candidates, threshold=threshold, top_k=1)
        return hits[0][0] if hits else None

    def extract_skills_semantic(
        self, text: str, known_skills: List[str], threshold: float = 0.65
    ) -> List[Dict[str, Any]]:
        sentences = [s.strip() for s in re.split(r"[.\n;]+", text) if len(s.strip()) > 12]
        if not sentences:
            sentences = [text[:400]] if text.strip() else []
        if not sentences:
            return []
        sent_embs = self.get_embeddings_batch(sentences)
        results = []
        for skill in known_skills:
            skill_emb = self.get_embedding(skill)
            sims = [_cosine(skill_emb, se) for se in sent_embs]
            best_i = int(np.argmax(sims)) if sims else 0
            best = sims[best_i] if sims else 0.0
            if best >= threshold or skill.lower() in text.lower():
                conf = max(best, 0.82 if skill.lower() in text.lower() else best)
                if conf < threshold:
                    continue
                results.append(
                    {
                        "skill": skill,
                        "confidence": round(float(min(1.0, conf)), 3),
                        "context": sentences[best_i][:220],
                    }
                )
        results.sort(key=lambda r: r["confidence"], reverse=True)
        return results

    def get_skill_relationships(
        self, skill: str, all_skills: List[str], top_k: int = 5
    ) -> List[Tuple[str, float]]:
        others = [s for s in all_skills if s.lower() != skill.lower()]
        return self.find_similar_skills(skill, others, threshold=0.35, top_k=top_k)

    def match_student_to_opportunities(
        self,
        student_profile: str,
        opportunity_descriptions: List[str],
        top_k: int = 10,
    ) -> List[Tuple[int, float]]:
        q = self.get_embedding(student_profile)
        scored = []
        for i, desc in enumerate(opportunity_descriptions):
            scored.append((i, _cosine(q, self.get_embedding(desc))))
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    def clear_cache(self) -> None:
        self.embedding_cache.clear()
        self.skill_embeddings.clear()


_embedding_service: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service
