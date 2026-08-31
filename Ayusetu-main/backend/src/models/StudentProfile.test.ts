/**
 * Unit tests for StudentProfile and AcademicianProfile models
 * Task 3.2 — Requirements: 2.2, 2.9, 3.7, 4.1, 5.2, 7.5, 9.1
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import StudentProfile, { VerificationLevel } from './StudentProfile';
import AcademicianProfile from './AcademicianProfile';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await StudentProfile.deleteMany({});
  await AcademicianProfile.deleteMany({});
});

// ─── VerificationLevel Enum ──────────────────────────────────────────────────

describe('VerificationLevel enum', () => {
  it('has exactly four levels in the correct progression', () => {
    expect(VerificationLevel.SELF_DECLARED).toBe('self_declared');
    expect(VerificationLevel.ASSESSMENT_VERIFIED).toBe('assessment_verified');
    expect(VerificationLevel.COURSE_VERIFIED).toBe('course_verified');
    expect(VerificationLevel.INDUSTRY_VERIFIED).toBe('industry_verified');
  });

  it('contains all expected string values', () => {
    const values = Object.values(VerificationLevel);
    expect(values).toEqual(['self_declared', 'assessment_verified', 'course_verified', 'industry_verified']);
  });
});

// ─── StudentProfile Schema ───────────────────────────────────────────────────

describe('StudentProfile model', () => {
  const userId = new mongoose.Types.ObjectId();

  const validProfile = () => ({
    userId,
    institution: 'IIT Delhi',
    department: 'Computer Science',
    branch: 'B.Tech CSE',
    graduationYear: 2025,
  });

  describe('required fields', () => {
    it('creates a profile with all required fields', async () => {
      const profile = await StudentProfile.create(validProfile());
      expect(profile.userId.toString()).toBe(userId.toString());
      expect(profile.institution).toBe('IIT Delhi');
      expect(profile.department).toBe('Computer Science');
      expect(profile.branch).toBe('B.Tech CSE');
      expect(profile.graduationYear).toBe(2025);
    });

    it('rejects creation when institution is missing', async () => {
      const data = validProfile() as Partial<typeof validProfile extends () => infer R ? R : never>;
      delete (data as any).institution;
      await expect(StudentProfile.create(data)).rejects.toThrow();
    });

    it('rejects creation when department is missing', async () => {
      const data = { ...validProfile(), department: undefined };
      await expect(StudentProfile.create(data)).rejects.toThrow();
    });

    it('rejects creation when branch is missing', async () => {
      const data = { ...validProfile(), branch: undefined };
      await expect(StudentProfile.create(data)).rejects.toThrow();
    });

    it('rejects creation when graduationYear is missing', async () => {
      const data = { ...validProfile(), graduationYear: undefined };
      await expect(StudentProfile.create(data)).rejects.toThrow();
    });
  });

  describe('optional fields with defaults', () => {
    it('sets isPlaced to false by default', async () => {
      const profile = await StudentProfile.create(validProfile());
      expect(profile.isPlaced).toBe(false);
    });

    it('sets placementReadinessScore to 0 by default', async () => {
      const profile = await StudentProfile.create(validProfile());
      expect(profile.placementReadinessScore).toBe(0);
    });

    it('sets aptitudeScore components to 0 by default', async () => {
      const profile = await StudentProfile.create(validProfile());
      expect(profile.aptitudeScore.logicalReasoning).toBe(0);
      expect(profile.aptitudeScore.quantitative).toBe(0);
      expect(profile.aptitudeScore.verbal).toBe(0);
    });
  });

  describe('cgpa validation', () => {
    it('accepts valid cgpa in range [0, 10]', async () => {
      const profile = await StudentProfile.create({ ...validProfile(), cgpa: 8.5 });
      expect(profile.cgpa).toBe(8.5);
    });

    it('rejects cgpa above 10', async () => {
      await expect(StudentProfile.create({ ...validProfile(), cgpa: 11 })).rejects.toThrow();
    });

    it('rejects cgpa below 0', async () => {
      await expect(StudentProfile.create({ ...validProfile(), cgpa: -1 })).rejects.toThrow();
    });
  });

  describe('skills subdocument', () => {
    it('stores a skill with all fields including verificationLevel', async () => {
      const skillId = new mongoose.Types.ObjectId();
      const profile = await StudentProfile.create({
        ...validProfile(),
        skills: [{
          skillId,
          name: 'JavaScript',
          score: 85,
          verificationLevel: VerificationLevel.ASSESSMENT_VERIFIED,
        }],
      });

      expect(profile.skills).toHaveLength(1);
      const skill = profile.skills[0];
      expect(skill.name).toBe('JavaScript');
      expect(skill.score).toBe(85);
      expect(skill.verificationLevel).toBe(VerificationLevel.ASSESSMENT_VERIFIED);
    });

    it('defaults skill verificationLevel to self_declared', async () => {
      const skillId = new mongoose.Types.ObjectId();
      const profile = await StudentProfile.create({
        ...validProfile(),
        skills: [{ skillId, name: 'Python', score: 70 }],
      });

      expect(profile.skills[0].verificationLevel).toBe(VerificationLevel.SELF_DECLARED);
    });

    it('rejects a skill score above 100 (Requirement 2.2)', async () => {
      const skillId = new mongoose.Types.ObjectId();
      await expect(
        StudentProfile.create({
          ...validProfile(),
          skills: [{ skillId, name: 'Python', score: 101 }],
        })
      ).rejects.toThrow();
    });

    it('rejects a skill score below 0 (Requirement 2.2)', async () => {
      const skillId = new mongoose.Types.ObjectId();
      await expect(
        StudentProfile.create({
          ...validProfile(),
          skills: [{ skillId, name: 'Python', score: -1 }],
        })
      ).rejects.toThrow();
    });

    it('rejects an invalid verificationLevel enum value (Requirement 9.1)', async () => {
      const skillId = new mongoose.Types.ObjectId();
      await expect(
        StudentProfile.create({
          ...validProfile(),
          skills: [{ skillId, name: 'Python', score: 70, verificationLevel: 'unknown_level' }],
        })
      ).rejects.toThrow();
    });

    it('stores verifiedBy and verifiedAt when skill is verified', async () => {
      const skillId = new mongoose.Types.ObjectId();
      const verifierId = new mongoose.Types.ObjectId();
      const verifiedAt = new Date();
      const profile = await StudentProfile.create({
        ...validProfile(),
        skills: [{
          skillId,
          name: 'SQL',
          score: 90,
          verificationLevel: VerificationLevel.INDUSTRY_VERIFIED,
          verifiedBy: verifierId,
          verifiedAt,
        }],
      });

      const skill = profile.skills[0];
      expect(skill.verifiedBy?.toString()).toBe(verifierId.toString());
      expect(skill.verifiedAt?.getTime()).toBe(verifiedAt.getTime());
    });
  });

  describe('aptitudeScore subdocument', () => {
    it('rejects aptitude score above 100', async () => {
      await expect(
        StudentProfile.create({
          ...validProfile(),
          aptitudeScore: { logicalReasoning: 101, quantitative: 50, verbal: 50 },
        })
      ).rejects.toThrow();
    });

    it('rejects aptitude score below 0', async () => {
      await expect(
        StudentProfile.create({
          ...validProfile(),
          aptitudeScore: { logicalReasoning: -5, quantitative: 50, verbal: 50 },
        })
      ).rejects.toThrow();
    });
  });

  describe('placementReadinessScore validation', () => {
    it('rejects a placementReadinessScore above 100', async () => {
      await expect(
        StudentProfile.create({ ...validProfile(), placementReadinessScore: 150 })
      ).rejects.toThrow();
    });

    it('rejects a placementReadinessScore below 0', async () => {
      await expect(
        StudentProfile.create({ ...validProfile(), placementReadinessScore: -10 })
      ).rejects.toThrow();
    });
  });

  describe('projects subdocument', () => {
    it('stores projects with verificationLevel', async () => {
      const profile = await StudentProfile.create({
        ...validProfile(),
        projects: [{
          title: 'E-Commerce App',
          description: 'React + Node.js',
          techStack: ['React', 'Node.js'],
          url: 'https://github.com/example',
          verificationLevel: VerificationLevel.SELF_DECLARED,
        }],
      });

      expect(profile.projects).toHaveLength(1);
      expect(profile.projects[0].title).toBe('E-Commerce App');
      expect(profile.projects[0].verificationLevel).toBe(VerificationLevel.SELF_DECLARED);
    });
  });

  describe('unique userId constraint', () => {
    it('rejects duplicate userId', async () => {
      await StudentProfile.create(validProfile());
      await expect(StudentProfile.create(validProfile())).rejects.toThrow();
    });
  });

  describe('timestamps', () => {
    it('sets createdAt and updatedAt automatically', async () => {
      const profile = await StudentProfile.create(validProfile());
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.updatedAt).toBeInstanceOf(Date);
    });
  });
});

// ─── AcademicianProfile Schema ───────────────────────────────────────────────

describe('AcademicianProfile model', () => {
  const userId = new mongoose.Types.ObjectId();

  const validProfile = () => ({
    userId,
    institution: 'IIT Delhi',
    department: 'Electrical Engineering',
    institutionalAffiliation: 'IIT Delhi — Department of Electrical Engineering',
  });

  describe('required fields', () => {
    it('creates a profile with all required fields', async () => {
      const profile = await AcademicianProfile.create(validProfile());
      expect(profile.userId.toString()).toBe(userId.toString());
      expect(profile.institution).toBe('IIT Delhi');
      expect(profile.department).toBe('Electrical Engineering');
      expect(profile.institutionalAffiliation).toBe('IIT Delhi — Department of Electrical Engineering');
    });

    it('rejects creation when institution is missing', async () => {
      const data = { ...validProfile(), institution: undefined };
      await expect(AcademicianProfile.create(data)).rejects.toThrow();
    });

    it('rejects creation when department is missing', async () => {
      const data = { ...validProfile(), department: undefined };
      await expect(AcademicianProfile.create(data)).rejects.toThrow();
    });

    it('rejects creation when institutionalAffiliation is missing (Requirement 7.5)', async () => {
      const data = { ...validProfile(), institutionalAffiliation: undefined };
      await expect(AcademicianProfile.create(data)).rejects.toThrow();
    });
  });

  describe('optional array fields', () => {
    it('stores expertiseAreas, publications, and researchInterests', async () => {
      const profile = await AcademicianProfile.create({
        ...validProfile(),
        expertiseAreas: ['Machine Learning', 'Signal Processing'],
        publications: ['IEEE 2023: Deep Learning for Signal Analysis'],
        researchInterests: ['Neural Networks', 'Computer Vision'],
      });

      expect(profile.expertiseAreas).toEqual(['Machine Learning', 'Signal Processing']);
      expect(profile.publications).toHaveLength(1);
      expect(profile.researchInterests).toContain('Neural Networks');
    });

    it('stores previousIndustryEngagements (Requirement 7.5)', async () => {
      const profile = await AcademicianProfile.create({
        ...validProfile(),
        previousIndustryEngagements: ['Consultant at TCS 2021', 'Research Collaboration with Infosys 2022'],
      });

      expect(profile.previousIndustryEngagements).toHaveLength(2);
    });

    it('accepts empty arrays for all optional array fields', async () => {
      const profile = await AcademicianProfile.create(validProfile());
      expect(profile.expertiseAreas).toEqual([]);
      expect(profile.publications).toEqual([]);
      expect(profile.researchInterests).toEqual([]);
      expect(profile.previousIndustryEngagements).toEqual([]);
    });
  });

  describe('cvUrl field', () => {
    it('stores cvUrl when provided', async () => {
      const profile = await AcademicianProfile.create({
        ...validProfile(),
        cvUrl: 'https://storage.example.com/cv/prof-sharma.pdf',
      });
      expect(profile.cvUrl).toBe('https://storage.example.com/cv/prof-sharma.pdf');
    });

    it('cvUrl is optional', async () => {
      const profile = await AcademicianProfile.create(validProfile());
      expect(profile.cvUrl).toBeUndefined();
    });
  });

  describe('unique userId constraint', () => {
    it('rejects duplicate userId', async () => {
      await AcademicianProfile.create(validProfile());
      await expect(AcademicianProfile.create(validProfile())).rejects.toThrow();
    });
  });

  describe('timestamps', () => {
    it('sets createdAt and updatedAt automatically', async () => {
      const profile = await AcademicianProfile.create(validProfile());
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.updatedAt).toBeInstanceOf(Date);
    });
  });
});
