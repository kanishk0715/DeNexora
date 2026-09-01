import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const AI_BASE = import.meta.env.VITE_AI_URL || 'http://localhost:8000';

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
  evidence?: string;
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
  evidenced_skills?: string[];
  self_declared_skills?: string[];
  education?: string[];
  clinical_hours?: number | null;
  location?: string | null;
  skill_summary?: string;
  suggested_gaps?: string[];
}

async function nlpPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${AI_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    return (json.data ?? json) as T;
  } catch {
    try {
      const res = await api.post(path.startsWith('/ai') ? path : `/ai${path}`, body);
      return (res.data?.data ?? null) as T;
    } catch {
      return null;
    }
  }
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
      `${AI_BASE}/ai/extract-resume-skills?use_semantic=${useSemantic}&confidence_threshold=${confidenceThreshold}`,
      { method: 'POST', body: form },
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data as ResumeExtractionResult;
  } catch {
    try {
      const form2 = new FormData();
      form2.append('file', file);
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token && token !== 'demo') headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(
        `${API_BASE}/ai/extract-resume-skills?use_semantic=${useSemantic}&confidence_threshold=${confidenceThreshold}`,
        { method: 'POST', headers, body: form2 },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data as ResumeExtractionResult;
    } catch {
      return { extracted_skills: [], count: 0, method: 'offline-fallback' };
    }
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
  const data = await nlpPost<{ matches: ProfileMatchResult[] }>('/ai/semantic-profile-match', {
    student_profile: studentProfile,
    opportunity_descriptions: opportunities,
    top_k: topK,
  });
  return data?.matches ?? [];
}

export async function nlpChat(question: string, extraChunks?: { id?: string; title?: string; text: string }[]) {
  return nlpPost<{ answer: string; sources: { id?: string; title?: string; score: number }[]; method: string }>(
    '/ai/chat',
    { question, extra_chunks: extraChunks },
  );
}

export async function explainOpportunityMatch(
  title: string,
  studentSkills: { name: string; score: number }[],
  requiredSkills: { name: string; required_score?: number; requiredScore?: number }[],
) {
  return nlpPost<{ match_score: number; explanation: string; matched: unknown[]; missing: unknown[]; weak: unknown[] }>(
    '/ai/explain-match',
    { title, student_skills: studentSkills, required_skills: requiredSkills },
  );
}

export async function rankApplicantsNlp(
  posting: Record<string, unknown>,
  applicants: Record<string, unknown>[],
) {
  return nlpPost<{ applicants: Array<Record<string, unknown> & { nlp_match: number; explanation: string; rank: number }> }>(
    '/ai/rank-applicants',
    { posting, applicants },
  );
}

export async function fetchSkillDemand(postings: Record<string, unknown>[]) {
  return nlpPost<{ topics: { topic_id: number; skills: string[] }[]; top_skills: { skill: string; postings: number }[] }>(
    '/ai/skill-demand',
    { postings, k: 4 },
  );
}

export async function fetchAssessmentFlags(answers: Record<string, unknown>[]) {
  return nlpPost<{ flags: string[]; guess_risk: string }>('/ai/assessment-flags', { answers });
}

export async function classifyResearchBlurbs(text: string) {
  return nlpPost<{ label: string; confidence: number }>('/ai/classify-research', { text });
}
