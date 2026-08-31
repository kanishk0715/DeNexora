import { GapPriority } from '../models/Assessment';

/**
 * Scoring engine for skill gap analysis, match scoring, and placement readiness
 * Requirements: 2.2, 2.9, 3.3, 5.2, 9.7
 */

// ─── Skill Gap ────────────────────────────────────────────────────────────────

/**
 * Compute skill gap and priority classification
 * gap = requiredScore - studentScore (clamped to 0 if student exceeds required)
 * Requirements: 2.2, 2.9
 */
export function computeSkillGap(
  requiredScore: number,
  studentScore: number
): { gap: number; gapPriority: GapPriority } {
  const gap = Math.max(0, requiredScore - studentScore);

  let gapPriority: GapPriority;
  if (gap <= 10) {
    gapPriority = GapPriority.READY;
  } else if (gap <= 25) {
    gapPriority = GapPriority.MODERATE;
  } else if (gap <= 40) {
    gapPriority = GapPriority.SIGNIFICANT;
  } else {
    gapPriority = GapPriority.MAJOR;
  }

  return { gap, gapPriority };
}

// ─── Match Score ──────────────────────────────────────────────────────────────

interface MatchScoreInput {
  technicalSkillMatch: number;  // 0-100
  softSkillMatch: number;       // 0-100
  educationMatch: number;       // 0-100
  careerInterestMatch: number;  // 0-100
  projectsMatch: number;        // 0-100
  locationMatch: number;        // 0-100
}

/**
 * Compute weighted Match_Score for a student–opportunity pair
 * Weights: Technical 50% | Soft 15% | Education 10% | Career 10% | Projects 10% | Location 5%
 * Requirements: 3.3, 5.2
 */
export function computeMatchScore(components: MatchScoreInput): number {
  const score =
    components.technicalSkillMatch * 0.50 +
    components.softSkillMatch * 0.15 +
    components.educationMatch * 0.10 +
    components.careerInterestMatch * 0.10 +
    components.projectsMatch * 0.10 +
    components.locationMatch * 0.05;

  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

// ─── Placement Readiness Score ────────────────────────────────────────────────

interface PlacementReadinessInput {
  technicalAvg: number;              // 0-100
  softAvg: number;                   // 0-100
  aptitudeAvg: number;               // 0-100
  projectsCountNormalized: number;   // 0-100 (normalize: min(projects/5, 1) * 100)
  certificationsCountNormalized: number; // 0-100 (normalize: min(certs/5, 1) * 100)
  internshipExperienceScore: number; // 0-100
  resumeQualityScore: number;        // 0-100
}

/**
 * Compute Placement_Readiness_Score
 * Weights: Technical 40% | Soft 15% | Aptitude 15% | Projects 10% | Certs 5% | Internship 10% | Resume 5%
 * Requirements: 9.7
 */
export function computePlacementReadinessScore(input: PlacementReadinessInput): number {
  const score =
    input.technicalAvg * 0.40 +
    input.softAvg * 0.15 +
    input.aptitudeAvg * 0.15 +
    input.projectsCountNormalized * 0.10 +
    input.certificationsCountNormalized * 0.05 +
    input.internshipExperienceScore * 0.10 +
    input.resumeQualityScore * 0.05;

  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

// ─── Helpers for building match score from profiles ──────────────────────────

/**
 * Compute technical skill match between a student's skills and required skills
 */
export function computeTechnicalSkillMatch(
  studentSkills: { name: string; score: number }[],
  requiredSkills: { name: string; requiredScore: number }[]
): number {
  if (requiredSkills.length === 0) return 100;

  const skillMap = new Map(studentSkills.map(s => [s.name.toLowerCase(), s.score]));
  let totalMatch = 0;

  for (const req of requiredSkills) {
    const studentScore = skillMap.get(req.name.toLowerCase()) ?? 0;
    totalMatch += Math.min(100, (studentScore / req.requiredScore) * 100);
  }

  return Math.min(100, Math.max(0, totalMatch / requiredSkills.length));
}

/**
 * Normalize a count to 0-100 scale
 * @param count actual count
 * @param maxExpected count that maps to 100
 */
export function normalizeCount(count: number, maxExpected: number): number {
  return Math.min(100, Math.max(0, (count / maxExpected) * 100));
}
