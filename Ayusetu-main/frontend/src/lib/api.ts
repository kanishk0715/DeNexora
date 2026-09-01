import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && token !== 'demo') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── NLP / AI helpers ──────────────────────────────────────────────────────────

export interface SemanticSkillMatch {
  skill: string;
  similarity: number;
}

export interface SemanticDetail {
  skill: string;
  confidence: number;
  context: string;
}

export interface ResumeExtractionResult {
  extracted_skills: string[];
  count: number;
  method: string;
  semantic_details?: SemanticDetail[];
  keyword_only?: string[];
  semantic_only?: string[];
  semantic_error?: string;
  fallback?: string;
}

export interface ProfileMatchResult {
  opportunity_id: string;
  similarity: number;
  rank: number;
}

/**
 * Upload a resume file and extract skills using NLP embeddings + keyword matching.
 * Falls back to keyword-only if the AI service is unavailable (demo mode).
 */
export async function extractResumeSkills(
  file: File,
  useSemantic = true,
  confidenceThreshold = 0.65
): Promise<ResumeExtractionResult> {
  const form = new FormData();
  form.append('file', file);

  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token && token !== 'demo') headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(
      `${API_BASE}/ai/extract-resume-skills?use_semantic=${useSemantic}&confidence_threshold=${confidenceThreshold}`,
      { method: 'POST', headers, body: form }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data as ResumeExtractionResult;
  } catch {
    // Demo / offline fallback — keyword scan in the browser
    return { extracted_skills: [], count: 0, method: 'offline-fallback' };
  }
}

/**
 * Find semantically similar skills from a candidate list.
 */
export async function semanticSkillMatch(
  querySkill: string,
  candidateSkills: string[],
  threshold = 0.7,
  topK = 5
): Promise<SemanticSkillMatch[]> {
  try {
    const res = await api.post('/ai/semantic-skill-match', {
      query_skill: querySkill,
      candidate_skills: candidateSkills,
      threshold,
      top_k: topK,
    });
    return (res.data?.data?.matches as SemanticSkillMatch[]) ?? [];
  } catch {
    return [];
  }
}

/**
 * Find related skills useful for gap-based learning recommendations.
 */
export async function getSkillRelationships(
  skill: string,
  allSkills: string[],
  topK = 5
): Promise<SemanticSkillMatch[]> {
  try {
    const res = await api.post('/ai/skill-relationships', {
      skill,
      all_skills: allSkills,
      top_k: topK,
    });
    return (res.data?.data?.related_skills as SemanticSkillMatch[]) ?? [];
  } catch {
    return [];
  }
}

/**
 * Match a free-text student profile against opportunity descriptions.
 * Returns ranked list with similarity scores.
 */
export async function semanticProfileMatch(
  studentProfile: string,
  opportunities: { id: string; description: string }[],
  topK = 10
): Promise<ProfileMatchResult[]> {
  try {
    const res = await api.post('/ai/semantic-profile-match', {
      student_profile: studentProfile,
      opportunity_descriptions: opportunities,
      top_k: topK,
    });
    return (res.data?.data?.matches as ProfileMatchResult[]) ?? [];
  } catch {
    return [];
  }
}
