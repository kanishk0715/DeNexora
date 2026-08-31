/**
 * Unit tests for Assessment and AssessmentResult models, and seed data structure.
 * Task 5.1 — Requirements: 2.1–2.6
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  Assessment,
  AssessmentResult,
  AssessmentCategory,
  GapPriority,
} from './Assessment';
import Skill from './Skill';
import { SkillCategory } from './Skill';

let mongoServer: MongoMemoryServer;

// Shared IDs used across tests
let skillId: mongoose.Types.ObjectId;
let adminId: mongoose.Types.ObjectId;
let studentId: mongoose.Types.ObjectId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create a real Skill document so skillId references are valid
  const skill = await Skill.create({
    name: 'JavaScript',
    aliases: ['javascript', 'js'],
    category: SkillCategory.TECHNICAL,
    industryBenchmark: 75,
  });
  skillId = skill._id as mongoose.Types.ObjectId;
  adminId = new mongoose.Types.ObjectId();
  studentId = new mongoose.Types.ObjectId();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Assessment.deleteMany({});
  await AssessmentResult.deleteMany({});
});

// ─── Helper builders ─────────────────────────────────────────────────────────

function buildQuestion(overrides: Partial<{
  text: string;
  options: string[];
  correctAnswer: number;
  skillId: mongoose.Types.ObjectId;
  difficulty: 'easy' | 'medium' | 'hard';
  isAdaptive: boolean;
}> = {}) {
  return {
    text: 'Sample question text?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0,
    skillId,
    difficulty: 'medium' as const,
    isAdaptive: false,
    ...overrides,
  };
}

function buildAssessment(overrides: Record<string, unknown> = {}) {
  return {
    title: 'Test Assessment',
    category: AssessmentCategory.COMBINED,
    durationMinutes: 30,
    isActive: true,
    createdBy: adminId,
    questions: [buildQuestion()],
    ...overrides,
  };
}

// ─── Assessment Schema ────────────────────────────────────────────────────────

describe('Assessment model', () => {
  describe('required fields', () => {
    it('creates an assessment with all required fields', async () => {
      const doc = await Assessment.create(buildAssessment());

      expect(doc.title).toBe('Test Assessment');
      expect(doc.category).toBe(AssessmentCategory.COMBINED);
      expect(doc.durationMinutes).toBe(30);
      expect(doc.isActive).toBe(true);
      expect(doc.createdBy.toString()).toBe(adminId.toString());
      expect(doc.questions).toHaveLength(1);
    });

    it('rejects creation when title is missing', async () => {
      const data = buildAssessment({ title: undefined });
      await expect(Assessment.create(data)).rejects.toThrow();
    });

    it('rejects creation when category is missing', async () => {
      const data = buildAssessment({ category: undefined });
      await expect(Assessment.create(data)).rejects.toThrow();
    });

    it('rejects creation with an invalid category enum value', async () => {
      const data = buildAssessment({ category: 'invalid_category' });
      await expect(Assessment.create(data)).rejects.toThrow();
    });

    it('rejects creation when createdBy is missing', async () => {
      const data = buildAssessment({ createdBy: undefined });
      await expect(Assessment.create(data)).rejects.toThrow();
    });
  });

  describe('durationMinutes field', () => {
    it('stores durationMinutes correctly', async () => {
      const doc = await Assessment.create(buildAssessment({ durationMinutes: 60 }));
      expect(doc.durationMinutes).toBe(60);
    });

    it('defaults durationMinutes to 60 when not provided', async () => {
      const data = buildAssessment();
      delete (data as Record<string, unknown>).durationMinutes;
      const doc = await Assessment.create(data);
      expect(doc.durationMinutes).toBe(60);
    });
  });

  describe('isActive field', () => {
    it('defaults isActive to true', async () => {
      const data = buildAssessment();
      delete (data as Record<string, unknown>).isActive;
      const doc = await Assessment.create(data);
      expect(doc.isActive).toBe(true);
    });

    it('stores isActive=false when explicitly set', async () => {
      const doc = await Assessment.create(buildAssessment({ isActive: false }));
      expect(doc.isActive).toBe(false);
    });
  });

  describe('questions subdocument', () => {
    it('stores a question with all fields', async () => {
      const doc = await Assessment.create(
        buildAssessment({
          questions: [
            buildQuestion({
              text: 'What is 2 + 2?',
              options: ['2', '3', '4', '5'],
              correctAnswer: 2,
              skillId,
              difficulty: 'easy',
              isAdaptive: true,
            }),
          ],
        })
      );

      expect(doc.questions).toHaveLength(1);
      const q = doc.questions[0];
      expect(q.text).toBe('What is 2 + 2?');
      expect(q.options).toEqual(['2', '3', '4', '5']);
      expect(q.correctAnswer).toBe(2);
      expect(q.skillId.toString()).toBe(skillId.toString());
      expect(q.difficulty).toBe('easy');
      expect(q.isAdaptive).toBe(true);
      // questionId is auto-generated
      expect(q.questionId).toBeInstanceOf(mongoose.Types.ObjectId);
    });

    it('defaults question difficulty to medium', async () => {
      const questionData = {
        text: 'A question',
        options: ['A', 'B'],
        correctAnswer: 0,
        skillId,
        isAdaptive: false,
      };
      const doc = await Assessment.create(
        buildAssessment({ questions: [questionData] })
      );
      expect(doc.questions[0].difficulty).toBe('medium');
    });

    it('defaults question isAdaptive to false', async () => {
      const questionData = {
        text: 'A question',
        options: ['A', 'B'],
        correctAnswer: 0,
        skillId,
      };
      const doc = await Assessment.create(
        buildAssessment({ questions: [questionData] })
      );
      expect(doc.questions[0].isAdaptive).toBe(false);
    });

    it('rejects an invalid difficulty enum on a question', async () => {
      const data = buildAssessment({
        questions: [buildQuestion({ difficulty: 'extreme' as 'easy' })],
      });
      await expect(Assessment.create(data)).rejects.toThrow();
    });

    it('supports multiple questions with mixed categories', async () => {
      const secondSkillId = new mongoose.Types.ObjectId();
      const doc = await Assessment.create(
        buildAssessment({
          questions: [
            buildQuestion({ difficulty: 'easy', skillId }),
            buildQuestion({ text: 'Soft skill question?', difficulty: 'hard', skillId: secondSkillId }),
          ],
        })
      );
      expect(doc.questions).toHaveLength(2);
    });
  });

  describe('timestamps', () => {
    it('sets createdAt automatically', async () => {
      const doc = await Assessment.create(buildAssessment());
      expect(doc.createdAt).toBeInstanceOf(Date);
    });
  });
});

// ─── AssessmentResult Schema ──────────────────────────────────────────────────

describe('AssessmentResult model', () => {
  let assessmentId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    const assessment = await Assessment.create(buildAssessment());
    assessmentId = assessment._id as mongoose.Types.ObjectId;
  });

  function buildResult(overrides: Record<string, unknown> = {}) {
    return {
      studentId,
      assessmentId,
      totalScore: 75,
      isActive: true,
      completedAt: new Date(),
      skillScores: [
        {
          skillId,
          skillName: 'JavaScript',
          score: 75,
          gap: 0,
          gapPriority: GapPriority.READY,
        },
      ],
      ...overrides,
    };
  }

  describe('required fields', () => {
    it('creates an assessment result with all required fields', async () => {
      const result = await AssessmentResult.create(buildResult());

      expect(result.studentId.toString()).toBe(studentId.toString());
      expect(result.assessmentId.toString()).toBe(assessmentId.toString());
      expect(result.totalScore).toBe(75);
      expect(result.isActive).toBe(true);
      expect(result.skillScores).toHaveLength(1);
    });

    it('rejects creation when studentId is missing', async () => {
      await expect(AssessmentResult.create(buildResult({ studentId: undefined }))).rejects.toThrow();
    });

    it('rejects creation when assessmentId is missing', async () => {
      await expect(AssessmentResult.create(buildResult({ assessmentId: undefined }))).rejects.toThrow();
    });

    it('rejects creation when totalScore is missing', async () => {
      await expect(AssessmentResult.create(buildResult({ totalScore: undefined }))).rejects.toThrow();
    });
  });

  describe('totalScore validation', () => {
    it('accepts totalScore=0', async () => {
      const result = await AssessmentResult.create(buildResult({ totalScore: 0 }));
      expect(result.totalScore).toBe(0);
    });

    it('accepts totalScore=100', async () => {
      const result = await AssessmentResult.create(buildResult({ totalScore: 100 }));
      expect(result.totalScore).toBe(100);
    });

    it('rejects totalScore above 100', async () => {
      await expect(AssessmentResult.create(buildResult({ totalScore: 101 }))).rejects.toThrow();
    });

    it('rejects totalScore below 0', async () => {
      await expect(AssessmentResult.create(buildResult({ totalScore: -1 }))).rejects.toThrow();
    });
  });

  describe('isActive field', () => {
    it('defaults isActive to true', async () => {
      const data = buildResult();
      delete (data as Record<string, unknown>).isActive;
      const result = await AssessmentResult.create(data);
      expect(result.isActive).toBe(true);
    });

    it('stores isActive=false (historical record)', async () => {
      const result = await AssessmentResult.create(buildResult({ isActive: false }));
      expect(result.isActive).toBe(false);
    });
  });

  describe('skillScores subdocument', () => {
    it('stores skillScores with all fields correctly', async () => {
      const result = await AssessmentResult.create(
        buildResult({
          skillScores: [
            {
              skillId,
              skillName: 'JavaScript',
              score: 50,
              gap: 25,
              gapPriority: GapPriority.MODERATE,
            },
          ],
        })
      );

      const ss = result.skillScores[0];
      expect(ss.skillName).toBe('JavaScript');
      expect(ss.score).toBe(50);
      expect(ss.gap).toBe(25);
      expect(ss.gapPriority).toBe(GapPriority.MODERATE);
    });

    it('stores all four gapPriority values correctly', async () => {
      for (const [priority, gap] of [
        [GapPriority.READY, 5],
        [GapPriority.MODERATE, 20],
        [GapPriority.SIGNIFICANT, 35],
        [GapPriority.MAJOR, 60],
      ] as [GapPriority, number][]) {
        const result = await AssessmentResult.create(
          buildResult({
            skillScores: [
              { skillId, skillName: 'Test', score: 40, gap, gapPriority: priority },
            ],
          })
        );
        expect(result.skillScores[0].gapPriority).toBe(priority);
        await AssessmentResult.deleteMany({});
      }
    });

    it('rejects an invalid gapPriority enum value', async () => {
      await expect(
        AssessmentResult.create(
          buildResult({
            skillScores: [
              { skillId, skillName: 'Test', score: 50, gap: 20, gapPriority: 'unknown' },
            ],
          })
        )
      ).rejects.toThrow();
    });

    it('rejects skillScore.score above 100', async () => {
      await expect(
        AssessmentResult.create(
          buildResult({
            skillScores: [
              { skillId, skillName: 'Test', score: 101, gap: 0, gapPriority: GapPriority.READY },
            ],
          })
        )
      ).rejects.toThrow();
    });

    it('rejects skillScore.score below 0', async () => {
      await expect(
        AssessmentResult.create(
          buildResult({
            skillScores: [
              { skillId, skillName: 'Test', score: -1, gap: 0, gapPriority: GapPriority.READY },
            ],
          })
        )
      ).rejects.toThrow();
    });

    it('stores multiple skillScores correctly', async () => {
      const secondSkillId = new mongoose.Types.ObjectId();
      const result = await AssessmentResult.create(
        buildResult({
          skillScores: [
            { skillId, skillName: 'JavaScript', score: 80, gap: 0, gapPriority: GapPriority.READY },
            { skillId: secondSkillId, skillName: 'Python', score: 40, gap: 30, gapPriority: GapPriority.SIGNIFICANT },
          ],
        })
      );
      expect(result.skillScores).toHaveLength(2);
      expect(result.skillScores[1].gapPriority).toBe(GapPriority.SIGNIFICANT);
    });
  });

  describe('timestamps and completedAt', () => {
    it('stores completedAt correctly', async () => {
      const completedAt = new Date('2024-01-15T10:00:00.000Z');
      const result = await AssessmentResult.create(buildResult({ completedAt }));
      expect(result.completedAt.toISOString()).toBe(completedAt.toISOString());
    });

    it('defaults completedAt to now when not provided', async () => {
      const before = new Date();
      const data = buildResult();
      delete (data as Record<string, unknown>).completedAt;
      const result = await AssessmentResult.create(data);
      const after = new Date();
      expect(result.completedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.completedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});

// ─── Seed data structure validation ──────────────────────────────────────────

describe('Seed data structure validity', () => {
  it('Assessment from seed can be instantiated without errors', async () => {
    const pythonSkill = await Skill.create({
      name: 'Python-seed-test',
      aliases: ['python'],
      category: SkillCategory.TECHNICAL,
      industryBenchmark: 70,
    });

    const seedDoc = await Assessment.create({
      title: 'Seed Structure Validation Assessment',
      category: AssessmentCategory.COMBINED,
      durationMinutes: 45,
      isActive: true,
      createdBy: adminId,
      questions: [
        {
          text: 'Which keyword declares a block-scoped variable in JavaScript?',
          options: ['var', 'let', 'function', 'global'],
          correctAnswer: 1,
          skillId,
          difficulty: 'easy',
          isAdaptive: false,
        },
        {
          text: 'Which data type is immutable in Python?',
          options: ['list', 'dict', 'tuple', 'set'],
          correctAnswer: 2,
          skillId: pythonSkill._id,
          difficulty: 'easy',
          isAdaptive: false,
        },
        {
          text: 'When presenting a complex idea to a non-technical audience, which approach is most effective?',
          options: [
            'Use technical jargon',
            'Skip the explanation',
            'Use analogies and simple language',
            'Assume they will research themselves',
          ],
          correctAnswer: 2,
          skillId,
          difficulty: 'easy',
          isAdaptive: false,
        },
        {
          text: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
          options: ['Yes', 'No', 'Cannot be determined', 'Only sometimes'],
          correctAnswer: 0,
          skillId,
          difficulty: 'easy',
          isAdaptive: false,
        },
        {
          text: 'A sequence: 2, 6, 18, 54, ?. What is the next number?',
          options: ['108', '162', '216', '270'],
          correctAnswer: 1,
          skillId,
          difficulty: 'medium',
          isAdaptive: false,
        },
      ],
    });

    expect(seedDoc._id).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(seedDoc.questions).toHaveLength(5);
    expect(seedDoc.durationMinutes).toBe(45);
    expect(seedDoc.isActive).toBe(true);
    expect(seedDoc.createdBy.toString()).toBe(adminId.toString());

    // Verify questions span multiple difficulty levels
    const difficulties = seedDoc.questions.map((q) => q.difficulty);
    expect(difficulties).toContain('easy');
    expect(difficulties).toContain('medium');

    await Skill.findByIdAndDelete(pythonSkill._id);
  });

  it('AssessmentResult from seed can be instantiated without errors', async () => {
    const assessment = await Assessment.create(buildAssessmentForSeed());

    const resultDoc = await AssessmentResult.create({
      studentId,
      assessmentId: assessment._id,
      totalScore: 68,
      isActive: true,
      completedAt: new Date(),
      skillScores: [
        {
          skillId,
          skillName: 'JavaScript',
          score: 80,
          gap: 0,
          gapPriority: GapPriority.READY,
        },
        {
          skillId: new mongoose.Types.ObjectId(),
          skillName: 'Python',
          score: 45,
          gap: 25,
          gapPriority: GapPriority.MODERATE,
        },
      ],
    });

    expect(resultDoc._id).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(resultDoc.totalScore).toBe(68);
    expect(resultDoc.skillScores).toHaveLength(2);
    expect(resultDoc.skillScores[0].gapPriority).toBe(GapPriority.READY);
    expect(resultDoc.skillScores[1].gapPriority).toBe(GapPriority.MODERATE);
  });
});

// Helper used only in seed structure tests
function buildAssessmentForSeed() {
  return {
    title: 'Seed Result Validation Assessment',
    category: AssessmentCategory.TECHNICAL,
    durationMinutes: 30,
    isActive: true,
    createdBy: adminId,
    questions: [buildQuestion()],
  };
}
