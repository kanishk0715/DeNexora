import * as fc from 'fast-check';
import { computeSkillGap, computeMatchScore } from './scoring';
import { GapPriority } from '../models/Assessment';

// ─── Unit Tests: computeSkillGap ─────────────────────────────────────────────

describe('computeSkillGap — unit tests', () => {
  // Boundary: exactly 0 gap (student meets requirement)
  it('returns gap=0 and priority=ready when student equals required', () => {
    const result = computeSkillGap(70, 70);
    expect(result.gap).toBe(0);
    expect(result.gapPriority).toBe(GapPriority.READY);
  });

  // Boundary: student exceeds requirement → gap clamped to 0
  it('clamps gap to 0 when student exceeds required (negative raw gap)', () => {
    const result = computeSkillGap(50, 80);
    expect(result.gap).toBe(0);
    expect(result.gapPriority).toBe(GapPriority.READY);
  });

  // Upper boundary of "ready" tier: gap = 10
  it('classifies gap=10 as ready', () => {
    const result = computeSkillGap(50, 40);
    expect(result.gap).toBe(10);
    expect(result.gapPriority).toBe(GapPriority.READY);
  });

  // Lower boundary of "moderate" tier: gap = 11
  it('classifies gap=11 as moderate', () => {
    const result = computeSkillGap(51, 40);
    expect(result.gap).toBe(11);
    expect(result.gapPriority).toBe(GapPriority.MODERATE);
  });

  // Upper boundary of "moderate" tier: gap = 25
  it('classifies gap=25 as moderate', () => {
    const result = computeSkillGap(65, 40);
    expect(result.gap).toBe(25);
    expect(result.gapPriority).toBe(GapPriority.MODERATE);
  });

  // Lower boundary of "significant" tier: gap = 26
  it('classifies gap=26 as significant', () => {
    const result = computeSkillGap(66, 40);
    expect(result.gap).toBe(26);
    expect(result.gapPriority).toBe(GapPriority.SIGNIFICANT);
  });

  // Upper boundary of "significant" tier: gap = 40
  it('classifies gap=40 as significant', () => {
    const result = computeSkillGap(80, 40);
    expect(result.gap).toBe(40);
    expect(result.gapPriority).toBe(GapPriority.SIGNIFICANT);
  });

  // Lower boundary of "major" tier: gap = 41
  it('classifies gap=41 as major', () => {
    const result = computeSkillGap(81, 40);
    expect(result.gap).toBe(41);
    expect(result.gapPriority).toBe(GapPriority.MAJOR);
  });

  // Extreme: maximum possible gap (required=100, student=0)
  it('classifies gap=100 as major', () => {
    const result = computeSkillGap(100, 0);
    expect(result.gap).toBe(100);
    expect(result.gapPriority).toBe(GapPriority.MAJOR);
  });

  // Both scores zero
  it('returns gap=0 and priority=ready when both scores are 0', () => {
    const result = computeSkillGap(0, 0);
    expect(result.gap).toBe(0);
    expect(result.gapPriority).toBe(GapPriority.READY);
  });

  // Mid-range moderate example
  it('computes correct gap and priority for typical moderate case', () => {
    const result = computeSkillGap(80, 60);
    expect(result.gap).toBe(20);
    expect(result.gapPriority).toBe(GapPriority.MODERATE);
  });

  // Mid-range significant example
  it('computes correct gap and priority for typical significant case', () => {
    const result = computeSkillGap(100, 65);
    expect(result.gap).toBe(35);
    expect(result.gapPriority).toBe(GapPriority.SIGNIFICANT);
  });
});

// ─── Property-Based Test: Skill Gap Non-Negativity and Classification Correctness ───
// Feature: academia-industry-portal, Property 1: Skill gap non-negativity and classification correctness

/**
 * Validates: Requirements 2.2, 2.9
 *
 * For any required (0-100) and student (0-100) scores:
 *   1. gap = max(0, required - student)  — always non-negative
 *   2. priority classification exactly matches the threshold bands
 */
function expectedPriority(gap: number): GapPriority {
  if (gap <= 10) return GapPriority.READY;
  if (gap <= 25) return GapPriority.MODERATE;
  if (gap <= 40) return GapPriority.SIGNIFICANT;
  return GapPriority.MAJOR;
}

describe('Property 1: Skill gap non-negativity and classification correctness', () => {
  it('gap is always non-negative and priority matches thresholds for all valid scores', () => {
    // Feature: academia-industry-portal, Property 1: Skill gap non-negativity and classification correctness
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),  // required score
        fc.integer({ min: 0, max: 100 }),  // student score
        (required, student) => {
          const { gap, gapPriority } = computeSkillGap(required, student);

          // Property 1a: gap equals max(0, required - student)
          const expectedGap = Math.max(0, required - student);
          expect(gap).toBe(expectedGap);

          // Property 1b: gap is always non-negative
          expect(gap).toBeGreaterThanOrEqual(0);

          // Property 1c: priority classification exactly matches thresholds
          expect(gapPriority).toBe(expectedPriority(expectedGap));
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Unit Tests: computeMatchScore ───────────────────────────────────────────

describe('computeMatchScore — unit tests', () => {
  // All zeros → result must be 0
  it('returns 0 when all components are 0', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 0,
      softSkillMatch: 0,
      educationMatch: 0,
      careerInterestMatch: 0,
      projectsMatch: 0,
      locationMatch: 0,
    });
    expect(result).toBe(0);
  });

  // All 100s → result must be 100
  it('returns 100 when all components are 100', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 100,
      softSkillMatch: 100,
      educationMatch: 100,
      careerInterestMatch: 100,
      projectsMatch: 100,
      locationMatch: 100,
    });
    expect(result).toBe(100);
  });

  // Only technical skill at 100, rest 0 → 0.50 × 100 = 50
  it('applies 50% weight to technical skill component', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 100,
      softSkillMatch: 0,
      educationMatch: 0,
      careerInterestMatch: 0,
      projectsMatch: 0,
      locationMatch: 0,
    });
    expect(result).toBe(50);
  });

  // Only soft skill at 100, rest 0 → 0.15 × 100 = 15
  it('applies 15% weight to soft skill component', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 0,
      softSkillMatch: 100,
      educationMatch: 0,
      careerInterestMatch: 0,
      projectsMatch: 0,
      locationMatch: 0,
    });
    expect(result).toBe(15);
  });

  // Only education at 100, rest 0 → 0.10 × 100 = 10
  it('applies 10% weight to education component', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 0,
      softSkillMatch: 0,
      educationMatch: 100,
      careerInterestMatch: 0,
      projectsMatch: 0,
      locationMatch: 0,
    });
    expect(result).toBe(10);
  });

  // Only career interest at 100, rest 0 → 0.10 × 100 = 10
  it('applies 10% weight to career interest component', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 0,
      softSkillMatch: 0,
      educationMatch: 0,
      careerInterestMatch: 100,
      projectsMatch: 0,
      locationMatch: 0,
    });
    expect(result).toBe(10);
  });

  // Only projects at 100, rest 0 → 0.10 × 100 = 10
  it('applies 10% weight to projects component', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 0,
      softSkillMatch: 0,
      educationMatch: 0,
      careerInterestMatch: 0,
      projectsMatch: 100,
      locationMatch: 0,
    });
    expect(result).toBe(10);
  });

  // Only location at 100, rest 0 → 0.05 × 100 = 5
  it('applies 5% weight to location component', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 0,
      softSkillMatch: 0,
      educationMatch: 0,
      careerInterestMatch: 0,
      projectsMatch: 0,
      locationMatch: 100,
    });
    expect(result).toBe(5);
  });

  // Known mixed-value example:
  // 0.50×80 + 0.15×60 + 0.10×70 + 0.10×50 + 0.10×40 + 0.05×90
  // = 40 + 9 + 7 + 5 + 4 + 4.5 = 69.5
  it('computes correct weighted score for a mixed-value input', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 80,
      softSkillMatch: 60,
      educationMatch: 70,
      careerInterestMatch: 50,
      projectsMatch: 40,
      locationMatch: 90,
    });
    expect(result).toBe(69.5);
  });

  // Partial match: only technical=60, rest 0 → 0.50 × 60 = 30
  it('computes partial score when only technical component is set', () => {
    const result = computeMatchScore({
      technicalSkillMatch: 60,
      softSkillMatch: 0,
      educationMatch: 0,
      careerInterestMatch: 0,
      projectsMatch: 0,
      locationMatch: 0,
    });
    expect(result).toBe(30);
  });
});

// ─── Property-Based Test: Match Score Bounded Range ──────────────────────────
// Feature: academia-industry-portal, Property 2: Match score bounded range

/**
 * Validates: Requirements 3.3, 5.2
 *
 * For any six components each in [0, 100], the computed Match_Score
 * SHALL be in the closed interval [0, 100].
 */
describe('Property 2: Match score bounded range [0, 100]', () => {
  it('match score is always in [0, 100] for any valid components', () => {
    // Feature: academia-industry-portal, Property 2: Match score bounded range
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        (technical, soft, education, career, projects, location) => {
          const score = computeMatchScore({
            technicalSkillMatch: technical,
            softSkillMatch: soft,
            educationMatch: education,
            careerInterestMatch: career,
            projectsMatch: projects,
            locationMatch: location,
          });

          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property-Based Test: Match Score Component Weight Integrity ─────────────
// Feature: academia-industry-portal, Property 3: Match score weights sum to 1.00

/**
 * Validates: Requirements 3.3
 *
 * The weights sum to exactly 1.00 (0.50+0.15+0.10+0.10+0.10+0.05).
 * When all six components equal the same value X, Match_Score must equal X,
 * because: X×(0.50+0.15+0.10+0.10+0.10+0.05) = X×1.00 = X.
 */
describe('Property 3: Match score weights sum to 1.00', () => {
  it('when all components are equal to X, match score equals X for any X in [0, 100]', () => {
    // Feature: academia-industry-portal, Property 3: Match score weights sum to 1.00
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        (x) => {
          const score = computeMatchScore({
            technicalSkillMatch: x,
            softSkillMatch: x,
            educationMatch: x,
            careerInterestMatch: x,
            projectsMatch: x,
            locationMatch: x,
          });

          // Due to floating-point rounding in the implementation (Math.round(score * 10) / 10),
          // we allow a tolerance of 0.1 (one decimal place of rounding)
          expect(score).toBeCloseTo(x, 1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Unit Tests: computePlacementReadinessScore ───────────────────────────────

import { computePlacementReadinessScore } from './scoring';

describe('computePlacementReadinessScore — unit tests', () => {
  // All zeros → 0
  it('returns 0 when all components are 0', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 0,
      softAvg: 0,
      aptitudeAvg: 0,
      projectsCountNormalized: 0,
      certificationsCountNormalized: 0,
      internshipExperienceScore: 0,
      resumeQualityScore: 0,
    });
    expect(result).toBe(0);
  });

  // All 100s → 100
  it('returns 100 when all components are 100', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 100,
      softAvg: 100,
      aptitudeAvg: 100,
      projectsCountNormalized: 100,
      certificationsCountNormalized: 100,
      internshipExperienceScore: 100,
      resumeQualityScore: 100,
    });
    expect(result).toBe(100);
  });

  // Only technicalAvg = 100, rest 0 → 0.40 × 100 = 40
  it('applies 40% weight to technicalAvg component', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 100,
      softAvg: 0,
      aptitudeAvg: 0,
      projectsCountNormalized: 0,
      certificationsCountNormalized: 0,
      internshipExperienceScore: 0,
      resumeQualityScore: 0,
    });
    expect(result).toBe(40);
  });

  // Only softAvg = 100, rest 0 → 0.15 × 100 = 15
  it('applies 15% weight to softAvg component', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 0,
      softAvg: 100,
      aptitudeAvg: 0,
      projectsCountNormalized: 0,
      certificationsCountNormalized: 0,
      internshipExperienceScore: 0,
      resumeQualityScore: 0,
    });
    expect(result).toBe(15);
  });

  // Only aptitudeAvg = 100, rest 0 → 0.15 × 100 = 15
  it('applies 15% weight to aptitudeAvg component', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 0,
      softAvg: 0,
      aptitudeAvg: 100,
      projectsCountNormalized: 0,
      certificationsCountNormalized: 0,
      internshipExperienceScore: 0,
      resumeQualityScore: 0,
    });
    expect(result).toBe(15);
  });

  // Only projectsCountNormalized = 100, rest 0 → 0.10 × 100 = 10
  it('applies 10% weight to projectsCountNormalized component', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 0,
      softAvg: 0,
      aptitudeAvg: 0,
      projectsCountNormalized: 100,
      certificationsCountNormalized: 0,
      internshipExperienceScore: 0,
      resumeQualityScore: 0,
    });
    expect(result).toBe(10);
  });

  // Only certificationsCountNormalized = 100, rest 0 → 0.05 × 100 = 5
  it('applies 5% weight to certificationsCountNormalized component', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 0,
      softAvg: 0,
      aptitudeAvg: 0,
      projectsCountNormalized: 0,
      certificationsCountNormalized: 100,
      internshipExperienceScore: 0,
      resumeQualityScore: 0,
    });
    expect(result).toBe(5);
  });

  // Only internshipExperienceScore = 100, rest 0 → 0.10 × 100 = 10
  it('applies 10% weight to internshipExperienceScore component', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 0,
      softAvg: 0,
      aptitudeAvg: 0,
      projectsCountNormalized: 0,
      certificationsCountNormalized: 0,
      internshipExperienceScore: 100,
      resumeQualityScore: 0,
    });
    expect(result).toBe(10);
  });

  // Only resumeQualityScore = 100, rest 0 → 0.05 × 100 = 5
  it('applies 5% weight to resumeQualityScore component', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 0,
      softAvg: 0,
      aptitudeAvg: 0,
      projectsCountNormalized: 0,
      certificationsCountNormalized: 0,
      internshipExperienceScore: 0,
      resumeQualityScore: 100,
    });
    expect(result).toBe(5);
  });

  // Known mixed-value example:
  // 0.40×80 + 0.15×70 + 0.15×60 + 0.10×50 + 0.05×40 + 0.10×30 + 0.05×20
  // = 32 + 10.5 + 9 + 5 + 2 + 3 + 1 = 62.5
  it('computes correct weighted score for a mixed-value input', () => {
    const result = computePlacementReadinessScore({
      technicalAvg: 80,
      softAvg: 70,
      aptitudeAvg: 60,
      projectsCountNormalized: 50,
      certificationsCountNormalized: 40,
      internshipExperienceScore: 30,
      resumeQualityScore: 20,
    });
    expect(result).toBe(62.5);
  });
});

// ─── Property-Based Test: Placement Readiness Score Bounded Range ─────────────
// Feature: academia-industry-portal, Property 4: Placement readiness score bounded range

/**
 * Validates: Requirements 9.7
 *
 * For any seven components each in [0, 100], the computed
 * Placement_Readiness_Score SHALL be in the closed interval [0, 100].
 */
describe('Property 4: Placement readiness score bounded range [0, 100]', () => {
  it('placement readiness score is always in [0, 100] for any valid components', () => {
    // Feature: academia-industry-portal, Property 4: Placement readiness score bounded range
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        (technical, soft, aptitude, projects, certs, internship, resume) => {
          const score = computePlacementReadinessScore({
            technicalAvg: technical,
            softAvg: soft,
            aptitudeAvg: aptitude,
            projectsCountNormalized: projects,
            certificationsCountNormalized: certs,
            internshipExperienceScore: internship,
            resumeQualityScore: resume,
          });

          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });
});
