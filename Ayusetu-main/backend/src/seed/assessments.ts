/**
 * Seed script for Skill documents and Assessment questionnaire data.
 * Idempotent: checks for existing data before inserting.
 *
 * Task 5.1 — Requirements: 2.1–2.6
 */

import mongoose from 'mongoose';
import Skill from '../models/Skill';
import { SkillCategory } from '../models/Skill';
import { Assessment, AssessmentCategory } from '../models/Assessment';

// ─── Skill seed data ─────────────────────────────────────────────────────────

const skillSeeds = [
  {
    name: 'JavaScript',
    aliases: ['javascript', 'js', 'ecmascript'],
    category: SkillCategory.TECHNICAL,
    description: 'A high-level, dynamic programming language primarily used for web development.',
    industryBenchmark: 75,
    industryDemandCount: 120,
  },
  {
    name: 'Python',
    aliases: ['python', 'python3', 'py'],
    category: SkillCategory.TECHNICAL,
    description: 'A versatile, high-level programming language popular for data science, AI, and web development.',
    industryBenchmark: 70,
    industryDemandCount: 150,
  },
  {
    name: 'Communication',
    aliases: ['communication', 'verbal communication', 'written communication'],
    category: SkillCategory.SOFT_SKILL,
    description: 'Ability to convey ideas clearly and effectively in verbal and written form.',
    industryBenchmark: 70,
    industryDemandCount: 200,
  },
  {
    name: 'Logical Reasoning',
    aliases: ['logical reasoning', 'logic', 'reasoning'],
    category: SkillCategory.APTITUDE,
    description: 'Ability to analyze information and draw valid conclusions.',
    industryBenchmark: 65,
    industryDemandCount: 180,
  },
  {
    name: 'Teamwork',
    aliases: ['teamwork', 'collaboration', 'team player'],
    category: SkillCategory.SOFT_SKILL,
    description: 'Ability to work effectively as part of a team.',
    industryBenchmark: 70,
    industryDemandCount: 190,
  },
  {
    name: 'SQL',
    aliases: ['sql', 'structured query language', 'mysql', 'postgresql'],
    category: SkillCategory.TECHNICAL,
    description: 'Structured Query Language for managing and querying relational databases.',
    industryBenchmark: 65,
    industryDemandCount: 100,
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────

export async function seedAssessments(): Promise<void> {
  console.log('[seed] Starting assessment seed...');

  // ── 1. Seed Skills (idempotent by name) ───────────────────────────────────

  const skillIds: Record<string, mongoose.Types.ObjectId> = {};

  for (const seed of skillSeeds) {
    const existing = await Skill.findOne({ name: seed.name });
    if (existing) {
      console.log(`[seed] Skill "${seed.name}" already exists — skipping.`);
      skillIds[seed.name] = existing._id as mongoose.Types.ObjectId;
    } else {
      const created = await Skill.create(seed);
      skillIds[seed.name] = created._id as mongoose.Types.ObjectId;
      console.log(`[seed] Created Skill "${seed.name}".`);
    }
  }

  // ── 2. Seed Assessment (idempotent by title) ──────────────────────────────

  const assessmentTitle = 'General Skill Assessment — Full Stack & Aptitude';

  const existingAssessment = await Assessment.findOne({ title: assessmentTitle });
  if (existingAssessment) {
    console.log(`[seed] Assessment "${assessmentTitle}" already exists — skipping.`);
    return;
  }

  // Use a placeholder admin ObjectId as createdBy
  // In production this would be the Platform_Admin's _id from the User collection.
  const platformAdminId = new mongoose.Types.ObjectId();

  await Assessment.create({
    title: assessmentTitle,
    category: AssessmentCategory.COMBINED,
    durationMinutes: 45,
    isActive: true,
    createdBy: platformAdminId,
    questions: [
      // ── Technical: JavaScript (easy) ───────────────────────────────────────
      {
        text: 'Which keyword declares a block-scoped variable in JavaScript?',
        options: ['var', 'let', 'function', 'global'],
        correctAnswer: 1,
        skillId: skillIds['JavaScript'],
        difficulty: 'easy',
        isAdaptive: false,
      },
      // ── Technical: JavaScript (medium) ────────────────────────────────────
      {
        text: 'What does the Array method `.reduce()` return?',
        options: [
          'A new array with all elements doubled',
          'A single value accumulated from all elements',
          'The first element matching a condition',
          'A boolean indicating if any element matches',
        ],
        correctAnswer: 1,
        skillId: skillIds['JavaScript'],
        difficulty: 'medium',
        isAdaptive: false,
      },
      // ── Technical: Python (easy) ───────────────────────────────────────────
      {
        text: 'Which data type is immutable in Python?',
        options: ['list', 'dict', 'tuple', 'set'],
        correctAnswer: 2,
        skillId: skillIds['Python'],
        difficulty: 'easy',
        isAdaptive: false,
      },
      // ── Technical: Python (medium) ─────────────────────────────────────────
      {
        text: 'What is the output of `print(type([]) == list)` in Python 3?',
        options: ['False', 'True', 'None', 'TypeError'],
        correctAnswer: 1,
        skillId: skillIds['Python'],
        difficulty: 'medium',
        isAdaptive: false,
      },
      // ── Technical: SQL (medium) ────────────────────────────────────────────
      {
        text: 'Which SQL clause is used to filter groups created by GROUP BY?',
        options: ['WHERE', 'HAVING', 'FILTER', 'LIMIT'],
        correctAnswer: 1,
        skillId: skillIds['SQL'],
        difficulty: 'medium',
        isAdaptive: false,
      },
      // ── Soft Skill: Communication (easy) ──────────────────────────────────
      {
        text: 'When presenting a complex idea to a non-technical audience, which approach is most effective?',
        options: [
          'Use as much technical jargon as possible to sound credible',
          'Skip the explanation and share a document instead',
          'Use analogies and simple language to convey the core concept',
          'Assume the audience will research it themselves',
        ],
        correctAnswer: 2,
        skillId: skillIds['Communication'],
        difficulty: 'easy',
        isAdaptive: false,
      },
      // ── Soft Skill: Teamwork (medium) ─────────────────────────────────────
      {
        text: 'A team member consistently misses deadlines. What is the best initial action?',
        options: [
          'Report them to management immediately',
          'Do their work yourself to meet the deadline',
          'Have a private, constructive conversation to understand and address the issue',
          'Ignore the problem and hope it resolves itself',
        ],
        correctAnswer: 2,
        skillId: skillIds['Teamwork'],
        difficulty: 'medium',
        isAdaptive: false,
      },
      // ── Aptitude: Logical Reasoning (easy) ────────────────────────────────
      {
        text: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
        options: ['Yes', 'No', 'Cannot be determined', 'Only sometimes'],
        correctAnswer: 0,
        skillId: skillIds['Logical Reasoning'],
        difficulty: 'easy',
        isAdaptive: false,
      },
      // ── Aptitude: Logical Reasoning (medium) ──────────────────────────────
      {
        text: 'A sequence: 2, 6, 18, 54, ?. What is the next number?',
        options: ['108', '162', '216', '270'],
        correctAnswer: 1,
        skillId: skillIds['Logical Reasoning'],
        difficulty: 'medium',
        isAdaptive: false,
      },
      // ── Technical: Python (hard, adaptive) ────────────────────────────────
      {
        text: 'In Python, what is the time complexity of looking up an element in a `dict`?',
        options: ['O(n)', 'O(log n)', 'O(1) average case', 'O(n²)'],
        correctAnswer: 2,
        skillId: skillIds['Python'],
        difficulty: 'hard',
        isAdaptive: true,
      },
    ],
  });

  console.log(`[seed] Created Assessment "${assessmentTitle}" with 10 questions.`);
  console.log('[seed] Assessment seed completed successfully.');
}
