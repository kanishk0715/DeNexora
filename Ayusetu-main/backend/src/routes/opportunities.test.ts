/**
 * Integration tests for Opportunity CRUD routes
 * Task 6.1 — Requirements: 4.1–4.6
 *
 * Tests: create, update, delete/withdraw, get by id, list
 * Role guards: Industry_Partner for write ops, auth required for reads
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express, { Application as ExpressApp } from 'express';
import Opportunity, { OpportunityStatus, OpportunityType } from '../models/Opportunity';
import ApplicationModel, { ApplicationStatus } from '../models/Application';
import Notification from '../models/Notification';
import User, { UserRole } from '../models/User';
import { generateToken } from '../utils/jwt';
import opportunityRoutes from './opportunities';

// ─── App setup ────────────────────────────────────────────────────────────────

function buildApp(): ExpressApp {
  const app = express();
  app.use(express.json());
  app.use('/api/opportunities', opportunityRoutes);
  return app;
}

// ─── Database setup ───────────────────────────────────────────────────────────

let mongoServer: MongoMemoryServer;
let app: ExpressApp;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-key-for-opportunities';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = buildApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Opportunity.deleteMany({});
  await Application.deleteMany({});
  await Notification.deleteMany({});
  await User.deleteMany({});
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeToken(userId: string, role: UserRole = UserRole.INDUSTRY): string {
  return generateToken({ userId, email: `${userId}@test.com`, role });
}

async function createIndustryUser(): Promise<{ user: any; token: string }> {
  const user = await User.create({
    name: 'Industry Corp',
    email: `industry-${Date.now()}@test.com`,
    passwordHash: 'hashed',
    role: UserRole.INDUSTRY,
    isEmailVerified: true,
  });
  const token = makeToken(String(user._id), UserRole.INDUSTRY);
  return { user, token };
}

async function createStudentUser(): Promise<{ user: any; token: string }> {
  const user = await User.create({
    name: 'Student User',
    email: `student-${Date.now()}@test.com`,
    passwordHash: 'hashed',
    role: UserRole.STUDENT,
    isEmailVerified: true,
  });
  const token = makeToken(String(user._id), UserRole.STUDENT);
  return { user, token };
}

/** Minimal valid opportunity payload (all required fields per Req 4.2) */
function validOpportunityPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    title: 'Backend Intern',
    type: OpportunityType.INTERNSHIP,
    requiredSkills: [{ name: 'Node.js', requiredScore: 60 }],
    duration: '3 months',
    numberOfPositions: 2,
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    ...overrides,
  };
}

async function createOpportunity(industryId: string, overrides: Record<string, unknown> = {}): Promise<any> {
  return Opportunity.create({
    industryId,
    title: 'Test Opportunity',
    type: OpportunityType.INTERNSHIP,
    description: 'Test description',
    requiredSkills: [{ name: 'Node.js', requiredScore: 60 }],
    duration: '3 months',
    numberOfPositions: 2,
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: OpportunityStatus.ACTIVE,
    ...overrides,
  });
}

// ─── POST /api/opportunities ──────────────────────────────────────────────────

describe('POST /api/opportunities — create opportunity', () => {
  it('returns 401 without token (Req 4.1)', async () => {
    const res = await request(app)
      .post('/api/opportunities')
      .send(validOpportunityPayload());

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 403 for a student role (non-industry) (Req 4.1)', async () => {
    const { token } = await createStudentUser();

    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send(validOpportunityPayload());

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when required fields are missing (Req 4.2)', async () => {
    const { token } = await createIndustryUser();

    // Send an empty body — all required fields missing
    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const errorFields = res.body.errors.map((e: any) => e.field);
    expect(errorFields).toContain('title');
    expect(errorFields).toContain('duration');
    expect(errorFields).toContain('numberOfPositions');
    expect(errorFields).toContain('applicationDeadline');
    expect(errorFields).toContain('requiredSkills');
  });

  it('returns 400 when requiredSkills is empty array (Req 4.2)', async () => {
    const { token } = await createIndustryUser();

    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send(validOpportunityPayload({ requiredSkills: [] }));

    expect(res.status).toBe(400);
    const errorFields = res.body.errors.map((e: any) => e.field);
    expect(errorFields).toContain('requiredSkills');
  });

  it('returns 400 for an invalid opportunity type (Req 4.6)', async () => {
    const { token } = await createIndustryUser();

    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send(validOpportunityPayload({ type: 'invalid_type' }));

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('creates opportunity and returns 201 with valid data (Req 4.1, 4.2)', async () => {
    const { token } = await createIndustryUser();

    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send(validOpportunityPayload({ description: 'Join our team!' }));

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.opportunity.title).toBe('Backend Intern');
    expect(res.body.data.opportunity.status).toBe(OpportunityStatus.ACTIVE);
    expect(res.body.data.opportunity.requiredSkills).toHaveLength(1);
  });

  it('stores the industryId from the authenticated user', async () => {
    const { user, token } = await createIndustryUser();

    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send(validOpportunityPayload());

    expect(res.status).toBe(201);
    expect(String(res.body.data.opportunity.industryId)).toBe(String(user._id));
  });

  it('supports all valid opportunity types (Req 4.6)', async () => {
    const { token } = await createIndustryUser();
    const validTypes = Object.values(OpportunityType);

    for (const type of validTypes) {
      const res = await request(app)
        .post('/api/opportunities')
        .set('Authorization', `Bearer ${token}`)
        .send(validOpportunityPayload({ type }));

      expect(res.status).toBe(201);
    }
  });
});

// ─── PUT /api/opportunities/:id ───────────────────────────────────────────────

describe('PUT /api/opportunities/:id — update opportunity', () => {
  it('returns 401 without token', async () => {
    const { user } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));

    const res = await request(app)
      .put(`/api/opportunities/${opp._id}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(401);
  });

  it('returns 403 for a non-industry role (student)', async () => {
    const { user } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));
    const { token: studentToken } = await createStudentUser();

    const res = await request(app)
      .put(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(403);
  });

  it('returns 403 for a different industry partner (non-owner)', async () => {
    const { user: owner } = await createIndustryUser();
    const opp = await createOpportunity(String(owner._id));

    // A different industry partner tries to update
    const { token: otherToken } = await createIndustryUser();

    const res = await request(app)
      .put(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hijacked Title' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for unknown opportunity id', async () => {
    const { token } = await createIndustryUser();
    const unknownId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put(`/api/opportunities/${unknownId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 200 and updates opportunity when owner edits (Req 4.4)', async () => {
    const { user, token } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));

    const res = await request(app)
      .put(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Backend Intern', numberOfPositions: 5 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.opportunity.title).toBe('Updated Backend Intern');
    expect(res.body.data.opportunity.numberOfPositions).toBe(5);
  });

  it('notifies existing applicants on update (Req 4.4)', async () => {
    const { user, token } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));
    const { user: student } = await createStudentUser();

    // Create an active application
    await Application.create({
      applicantId: student._id,
      opportunityId: opp._id,
      status: ApplicationStatus.APPLIED,
      statusHistory: [{ status: ApplicationStatus.APPLIED, changedAt: new Date(), changedBy: student._id }],
    });

    await request(app)
      .put(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    const notifications = await Notification.find({ recipientId: student._id });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toMatch(/updated/i);
  });

  it('does not notify withdrawn/rejected applicants on update (Req 4.4)', async () => {
    const { user, token } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));
    const { user: student } = await createStudentUser();

    // Withdrawn application — should NOT be notified
    await Application.create({
      applicantId: student._id,
      opportunityId: opp._id,
      status: ApplicationStatus.WITHDRAWN,
      statusHistory: [{ status: ApplicationStatus.WITHDRAWN, changedAt: new Date(), changedBy: student._id }],
    });

    await request(app)
      .put(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    const notifications = await Notification.find({ recipientId: student._id });
    expect(notifications).toHaveLength(0);
  });

  it('returns 400 when trying to edit a withdrawn opportunity', async () => {
    const { user, token } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id), { status: OpportunityStatus.WITHDRAWN });

    const res = await request(app)
      .put(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── DELETE /api/opportunities/:id ────────────────────────────────────────────

describe('DELETE /api/opportunities/:id — withdraw opportunity', () => {
  it('returns 401 without token', async () => {
    const { user } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));

    const res = await request(app).delete(`/api/opportunities/${opp._id}`);

    expect(res.status).toBe(401);
  });

  it('returns 403 for a non-industry role', async () => {
    const { user } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));
    const { token: studentToken } = await createStudentUser();

    const res = await request(app)
      .delete(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
  });

  it('returns 403 for non-owner industry partner', async () => {
    const { user: owner } = await createIndustryUser();
    const opp = await createOpportunity(String(owner._id));
    const { token: otherToken } = await createIndustryUser();

    const res = await request(app)
      .delete(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for unknown opportunity id', async () => {
    const { token } = await createIndustryUser();
    const unknownId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .delete(`/api/opportunities/${unknownId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('withdraws the opportunity (status → withdrawn) and returns 200 (Req 4.5)', async () => {
    const { user, token } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));

    const res = await request(app)
      .delete(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updated = await Opportunity.findById(opp._id);
    expect(updated!.status).toBe(OpportunityStatus.WITHDRAWN);
  });

  it('notifies all active applicants on withdrawal (Req 4.5)', async () => {
    const { user, token } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));
    const { user: student1 } = await createStudentUser();
    const { user: student2 } = await createStudentUser();

    // Two active applications
    await Application.insertMany([
      {
        applicantId: student1._id,
        opportunityId: opp._id,
        status: ApplicationStatus.APPLIED,
        statusHistory: [{ status: ApplicationStatus.APPLIED, changedAt: new Date(), changedBy: student1._id }],
      },
      {
        applicantId: student2._id,
        opportunityId: opp._id,
        status: ApplicationStatus.SHORTLISTED,
        statusHistory: [{ status: ApplicationStatus.SHORTLISTED, changedAt: new Date(), changedBy: student2._id }],
      },
    ]);

    await request(app)
      .delete(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`);

    const notifications = await Notification.find({
      recipientId: { $in: [student1._id, student2._id] },
    });
    expect(notifications).toHaveLength(2);
    notifications.forEach(n => {
      expect(n.title).toMatch(/withdrawn/i);
    });
  });

  it('does not notify withdrawn/rejected applicants on withdrawal', async () => {
    const { user, token } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));
    const { user: student } = await createStudentUser();

    await Application.create({
      applicantId: student._id,
      opportunityId: opp._id,
      status: ApplicationStatus.REJECTED,
      statusHistory: [{ status: ApplicationStatus.REJECTED, changedAt: new Date(), changedBy: user._id }],
    });

    await request(app)
      .delete(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`);

    const notifications = await Notification.find({ recipientId: student._id });
    expect(notifications).toHaveLength(0);
  });
});

// ─── GET /api/opportunities/:id ───────────────────────────────────────────────

describe('GET /api/opportunities/:id — get single opportunity', () => {
  it('returns 401 without token', async () => {
    const { user } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));

    const res = await request(app).get(`/api/opportunities/${opp._id}`);

    expect(res.status).toBe(401);
  });

  it('returns 404 for unknown id', async () => {
    const { token } = await createStudentUser();
    const unknownId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .get(`/api/opportunities/${unknownId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 200 with opportunity data', async () => {
    const { user } = await createIndustryUser();
    const opp = await createOpportunity(String(user._id));
    const { token } = await createStudentUser();

    const res = await request(app)
      .get(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.opportunity._id).toBe(String(opp._id));
    expect(res.body.data.opportunity.title).toBe('Test Opportunity');
  });

  it('auto-closes opportunity when deadline has passed (Req 4.3)', async () => {
    const { user } = await createIndustryUser();
    // Create with a past deadline and active status
    const opp = await createOpportunity(String(user._id), {
      applicationDeadline: new Date(Date.now() - 1000), // 1 second ago
      status: OpportunityStatus.ACTIVE,
    });
    const { token } = await createStudentUser();

    const res = await request(app)
      .get(`/api/opportunities/${opp._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.opportunity.status).toBe(OpportunityStatus.CLOSED);

    // Verify it's persisted in the database
    const dbOpp = await Opportunity.findById(opp._id);
    expect(dbOpp!.status).toBe(OpportunityStatus.CLOSED);
  });
});

// ─── GET /api/opportunities ───────────────────────────────────────────────────

describe('GET /api/opportunities — list opportunities', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/opportunities');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 200 with empty list when no opportunities exist', async () => {
    const { token } = await createStudentUser();

    const res = await request(app)
      .get('/api/opportunities')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.opportunities).toHaveLength(0);
    expect(res.body.data.total).toBe(0);
  });

  it('returns 200 with list of opportunities', async () => {
    const { user } = await createIndustryUser();
    await createOpportunity(String(user._id), { title: 'Opportunity 1' });
    await createOpportunity(String(user._id), { title: 'Opportunity 2' });
    const { token } = await createStudentUser();

    const res = await request(app)
      .get('/api/opportunities')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.opportunities).toHaveLength(2);
    expect(res.body.data.total).toBe(2);
  });

  it('does not return withdrawn opportunities', async () => {
    const { user } = await createIndustryUser();
    await createOpportunity(String(user._id), { title: 'Active' });
    await createOpportunity(String(user._id), { title: 'Withdrawn', status: OpportunityStatus.WITHDRAWN });
    const { token } = await createStudentUser();

    const res = await request(app)
      .get('/api/opportunities')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.opportunities).toHaveLength(1);
    expect(res.body.data.opportunities[0].title).toBe('Active');
  });

  it('returns pagination metadata', async () => {
    const { user } = await createIndustryUser();
    await createOpportunity(String(user._id));
    const { token } = await createStudentUser();

    const res = await request(app)
      .get('/api/opportunities?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.page).toBe(1);
    expect(res.body.data.limit).toBe(10);
  });

  it('auto-closes expired active opportunities on list (Req 4.3)', async () => {
    const { user } = await createIndustryUser();
    // Create with a past deadline
    const opp = await createOpportunity(String(user._id), {
      applicationDeadline: new Date(Date.now() - 1000),
      status: OpportunityStatus.ACTIVE,
    });
    const { token } = await createStudentUser();

    await request(app)
      .get('/api/opportunities')
      .set('Authorization', `Bearer ${token}`);

    // The opportunity should be auto-closed in DB
    const dbOpp = await Opportunity.findById(opp._id);
    expect(dbOpp!.status).toBe(OpportunityStatus.CLOSED);
  });

  it('industry partner can also list opportunities', async () => {
    const { user, token } = await createIndustryUser();
    await createOpportunity(String(user._id));

    const res = await request(app)
      .get('/api/opportunities')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.opportunities).toHaveLength(1);
  });
});
