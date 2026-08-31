/**
 * Integration tests for Assessment routes
 * Task 5.2 — Requirements: 2.1–2.6
 *
 * Tests: list, get-by-id, submit (scoring + AssessmentResult persistence), results history
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express, { Application } from 'express';
import { Assessment, AssessmentResult } from '../models/Assessment';
import { AssessmentCategory, GapPriority } from '../models/Assessment';
import StudentProfile from '../models/StudentProfile';
import { VerificationLevel } from '../models/StudentProfile';
import Skill from '../models/Skill';
import { SkillCategory } from '../models/Skill';
import User, { UserRole } from '../models/User';
import { generateToken } from '../utils/jwt';
import assessmentRoutes from './assessments';

// ─── App setup ────────────────────────────────────────────────────────────────

function buildApp(): Application {
  const app = express();
  app.use(express.json());
  app.use('/api/assessments', assessmentRoutes);
  return app;
}

// ─── Database setup ───────────────────────────────────────────────────────────

let mongoServer: MongoMemoryServer;
let app: Application;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-key-for-assessments';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = buildApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Assessment.deleteMany({});
  await AssessmentResult.deleteMany({});
  await StudentProfile.deleteMany({});
  await Skill.deleteMany({});
  await User.deleteMany({});
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function createSkill(name: string, benchmark = 70) {
  return Skill.create({
    name,
    aliases: [name.toLowerCase()],
    category: SkillCategory.TECHNICAL,
    industryBenchmark: benchmark,
  });
}

async function createStudentUser() {
  return User.create({
    name: 'Test Student',
    email: `student-${Date.now()}@test.com`,
    passwordHash: 'hashedpassword',
    role: UserRole.STUDENT,
    isEmailVerified: true,
  });
}

async function createStudentProfile(userId: mongoose.Types.ObjectId) {
  return StudentProfile.create({
    userId,
    institution: 'Test University',
    department: 'Computer Science',
    branch: 'CSE',
    graduationYear: 2025,
  });
}

function makeToken(userId: string, role: UserRole = UserRole.STUDENT) {
  return generateToken({ userId, email: 'test@test.com', role });
}

/**
 * Build a minimal assessment with two questions on the given skill.
 * Both questions have correctAnswer = 0.
 */
async function createAssessment(skillId: mongoose.Types.ObjectId, isActive = true) {
  const adminId = new mongoose.Types.ObjectId();
  return Assessment.create({
    title: 'JavaScript Fundamentals',
    category: AssessmentCategory.TECHNICAL,
    durationMinutes: 30,
    isActive,
    createdBy: adminId,
    questions: [
      {
        text: 'What is the output of typeof null?',
        options: ['object', 'null', 'undefined', 'string'],
        correctAnswer: 0,
        skillId,
        difficulty: 'easy',
        isAdaptive: false,
      },
      {
        text: 'Which keyword declares a block-scoped variable?',
        options: ['let', 'var', 'function', 'global'],
        correctAnswer: 0,
        skillId,
        difficulty: 'easy',
        isAdaptive: false,
      },
    ],
  });
}

// ─── GET /api/assessments ─────────────────────────────────────────────────────

describe('GET /api/assessments — list active assessments', () => {
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/assessments');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns empty list when no assessments exist', async () => {
    const user = await createStudentUser();
    const token = makeToken(String(user._id));

    const res = await request(app)
      .get('/api/assessments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.assessments).toHaveLength(0);
  });

  it('returns only active assessments (Req 2.1)', async () => {
    const skill = await createSkill('JavaScript');
    const skillId = skill._id as mongoose.Types.ObjectId;

    // Create one active and one inactive
    await createAssessment(skillId, true);
    await createAssessment(skillId, false);

    const user = await createStudentUser();
    const token = makeToken(String(user._id));

    const res = await request(app)
      .get('/api/assessments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.assessments).toHaveLength(1);
    expect(res.body.data.assessments[0].title).toBe('JavaScript Fundamentals');
  });

  it('does not include correctAnswer in the list response', async () => {
    const skill = await createSkill('Python');
    await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    const token = makeToken(String(user._id));

    const res = await request(app)
      .get('/api/assessments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // The list endpoint uses .select('title category durationMinutes questions._id')
    // so correctAnswer should not appear in questions
    const assessment = res.body.data.assessments[0];
    if (assessment.questions && assessment.questions.length > 0) {
      expect(assessment.questions[0].correctAnswer).toBeUndefined();
    }
  });
});

// ─── GET /api/assessments/:id ─────────────────────────────────────────────────

describe('GET /api/assessments/:id — get assessment by ID', () => {
  it('returns 401 when no token is provided', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/assessments/${fakeId}`);
    expect(res.status).toBe(401);
  });

  it('returns 404 for an unknown ID', async () => {
    const user = await createStudentUser();
    const token = makeToken(String(user._id));
    const unknownId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .get(`/api/assessments/${unknownId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for an inactive assessment', async () => {
    const skill = await createSkill('JavaScript');
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId, false);

    const user = await createStudentUser();
    const token = makeToken(String(user._id));

    const res = await request(app)
      .get(`/api/assessments/${assessment._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('returns assessment with questions but without correctAnswer (Req 2.1)', async () => {
    const skill = await createSkill('JavaScript');
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    const token = makeToken(String(user._id));

    const res = await request(app)
      .get(`/api/assessments/${assessment._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const a = res.body.data.assessment;
    expect(a.title).toBe('JavaScript Fundamentals');
    expect(a.questions).toHaveLength(2);
    // correctAnswer must be stripped
    for (const q of a.questions) {
      expect(q.correctAnswer).toBeUndefined();
      expect(q.text).toBeDefined();
      expect(q.options).toHaveLength(4);
    }
  });
});

// ─── POST /api/assessments/:id/submit ─────────────────────────────────────────

describe('POST /api/assessments/:id/submit — submit assessment', () => {
  it('returns 401 when no token is provided', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post(`/api/assessments/${fakeId}/submit`)
      .send({ answers: [] });
    expect(res.status).toBe(401);
  });

  it('returns 403 when a non-student role submits', async () => {
    const skill = await createSkill('JavaScript');
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const adminId = new mongoose.Types.ObjectId().toString();
    const token = makeToken(adminId, UserRole.ADMIN);

    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 0,
    }));

    const res = await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when answers array is missing (Req 2.6)', async () => {
    const skill = await createSkill('JavaScript');
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    const token = makeToken(String(user._id));

    const res = await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects submission with unanswered mandatory questions (Req 2.6)', async () => {
    const skill = await createSkill('JavaScript');
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    const token = makeToken(String(user._id));

    // Only answer one of two questions
    const partialAnswers = [
      {
        questionId: assessment.questions[0].questionId.toString(),
        selectedOption: 0,
      },
    ];

    const res = await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers: partialAnswers });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/answered/i);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].field).toBe(
      assessment.questions[1].questionId.toString()
    );
  });

  it('creates AssessmentResult with isActive=true on valid submission (Req 2.2, 2.4)', async () => {
    const skill = await createSkill('JavaScript', 70);
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    await createStudentProfile(user._id as mongoose.Types.ObjectId);
    const token = makeToken(String(user._id));

    // Answer all questions correctly (correctAnswer = 0 for both)
    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 0,
    }));

    const res = await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const result = res.body.data.result;
    expect(result.isActive).toBe(true);
    expect(result.totalScore).toBe(100); // both correct → 100%
    expect(result.skillScores).toHaveLength(1);
    expect(result.skillScores[0].skillName).toBe('JavaScript');
    expect(result.skillScores[0].score).toBe(100);
    // gap = 70 - 100 → clamped to 0 → ready
    expect(result.skillScores[0].gapPriority).toBe(GapPriority.READY);
  });

  it('persists AssessmentResult in the database (Req 2.4)', async () => {
    const skill = await createSkill('JavaScript', 80);
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    await createStudentProfile(user._id as mongoose.Types.ObjectId);
    const token = makeToken(String(user._id));

    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 0,
    }));

    await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    const saved = await AssessmentResult.findOne({ studentId: user._id });
    expect(saved).not.toBeNull();
    expect(saved!.isActive).toBe(true);
    expect(saved!.totalScore).toBe(100);
  });

  it('marks previous results inactive on resubmission (Req 2.5)', async () => {
    const skill = await createSkill('JavaScript', 70);
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    await createStudentProfile(user._id as mongoose.Types.ObjectId);
    const token = makeToken(String(user._id));

    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 0,
    }));

    // First submission
    await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    // Second submission (retake)
    await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    const allResults = await AssessmentResult.find({ studentId: user._id });
    expect(allResults).toHaveLength(2);

    const activeResults = allResults.filter(r => r.isActive);
    const inactiveResults = allResults.filter(r => !r.isActive);
    expect(activeResults).toHaveLength(1);
    expect(inactiveResults).toHaveLength(1);
  });

  it('updates StudentProfile skills with assessment_verified level (Req 2.2)', async () => {
    const skill = await createSkill('JavaScript', 70);
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    await createStudentProfile(user._id as mongoose.Types.ObjectId);
    const token = makeToken(String(user._id));

    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 0,
    }));

    await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    const profile = await StudentProfile.findOne({ userId: user._id });
    expect(profile).not.toBeNull();
    expect(profile!.skills).toHaveLength(1);
    expect(profile!.skills[0].name).toBe('JavaScript');
    expect(profile!.skills[0].verificationLevel).toBe(VerificationLevel.ASSESSMENT_VERIFIED);
    expect(profile!.skills[0].score).toBe(100);
  });

  it('computes correct score when no answers are correct', async () => {
    const skill = await createSkill('JavaScript', 70);
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    await createStudentProfile(user._id as mongoose.Types.ObjectId);
    const token = makeToken(String(user._id));

    // Answer all questions incorrectly (correctAnswer=0, we choose 1)
    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 1,
    }));

    const res = await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.data.result.totalScore).toBe(0);
    expect(res.body.data.result.skillScores[0].score).toBe(0);
    // gap = 70 - 0 = 70 → major
    expect(res.body.data.result.skillScores[0].gapPriority).toBe(GapPriority.MAJOR);
  });

  it('returns 404 for unknown assessment id', async () => {
    const user = await createStudentUser();
    const token = makeToken(String(user._id));
    const unknownId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post(`/api/assessments/${unknownId}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers: [] });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─── GET /api/assessments/results/:studentId ──────────────────────────────────

describe('GET /api/assessments/results/:studentId — assessment history', () => {
  it('returns 401 when no token is provided', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/assessments/results/${fakeId}`);
    expect(res.status).toBe(401);
  });

  it('student can fetch their own results', async () => {
    const skill = await createSkill('JavaScript', 70);
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    await createStudentProfile(user._id as mongoose.Types.ObjectId);
    const token = makeToken(String(user._id));

    // Submit once to create a result
    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 0,
    }));
    await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    const res = await request(app)
      .get(`/api/assessments/results/${String(user._id)}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.results).toHaveLength(1);
    expect(res.body.data.results[0].isActive).toBe(true);
  });

  it('student cannot fetch another student results (403)', async () => {
    const user1 = await createStudentUser();
    const user2 = await createStudentUser();
    const token1 = makeToken(String(user1._id));

    const res = await request(app)
      .get(`/api/assessments/results/${String(user2._id)}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('admin can fetch any student results', async () => {
    const skill = await createSkill('JavaScript', 70);
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const student = await createStudentUser();
    await createStudentProfile(student._id as mongoose.Types.ObjectId);
    const studentToken = makeToken(String(student._id));

    // Submit once
    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 0,
    }));
    await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ answers });

    // Admin fetches student's results
    const adminId = new mongoose.Types.ObjectId().toString();
    const adminToken = makeToken(adminId, UserRole.ADMIN);

    const res = await request(app)
      .get(`/api/assessments/results/${String(student._id)}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.results).toHaveLength(1);
  });

  it('returns history in descending order by completedAt (most recent first)', async () => {
    const skill = await createSkill('JavaScript', 70);
    const assessment = await createAssessment(skill._id as mongoose.Types.ObjectId);

    const user = await createStudentUser();
    await createStudentProfile(user._id as mongoose.Types.ObjectId);
    const token = makeToken(String(user._id));

    const answers = assessment.questions.map(q => ({
      questionId: q.questionId.toString(),
      selectedOption: 0,
    }));

    // Submit twice
    await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    await request(app)
      .post(`/api/assessments/${assessment._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });

    const res = await request(app)
      .get(`/api/assessments/results/${String(user._id)}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const results = res.body.data.results;
    expect(results).toHaveLength(2);

    // Verify most recent is first (isActive=true should be first due to sort)
    expect(results[0].isActive).toBe(true);
    expect(results[1].isActive).toBe(false);
  });

  it('returns empty array when student has no results', async () => {
    const user = await createStudentUser();
    const token = makeToken(String(user._id));

    const res = await request(app)
      .get(`/api/assessments/results/${String(user._id)}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.results).toHaveLength(0);
  });
});
