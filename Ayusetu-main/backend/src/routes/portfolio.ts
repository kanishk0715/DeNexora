import express, { Request, Response } from 'express';
import Portfolio from '../models/Portfolio';
import StudentProfile, { VerificationLevel } from '../models/StudentProfile';
import { authMiddleware } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { UserRole } from '../models/User';

const router = express.Router();

/**
 * GET /api/portfolio/:username
 * Public portfolio endpoint — no auth required
 * Filters self_declared items if showSelfDeclaredItems is false
 * Requirements: 9.4, 9.5
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne({ publicSlug: req.params.slug });
    if (!portfolio || !portfolio.isPublic) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const studentProfile = await StudentProfile.findOne({ userId: portfolio.studentId });

    // Filter skills by verification level unless student enabled self-declared display
    let skills = studentProfile?.skills ?? [];
    if (!portfolio.showSelfDeclaredItems) {
      skills = skills.filter(s => s.verificationLevel !== VerificationLevel.SELF_DECLARED);
    }

    const certifications = portfolio.showSelfDeclaredItems
      ? portfolio.certifications
      : portfolio.certifications.filter(c => c.verificationLevel !== VerificationLevel.SELF_DECLARED);

    const projects = portfolio.showSelfDeclaredItems
      ? portfolio.projects
      : portfolio.projects.filter(p => p.verificationLevel !== VerificationLevel.SELF_DECLARED);

    res.json({
      success: true,
      message: 'Portfolio retrieved',
      data: {
        portfolio: {
          slug: portfolio.publicSlug,
          skills,
          certifications,
          internshipRecords: portfolio.internshipRecords,
          projects,
          achievements: portfolio.achievements,
          placementReadinessScore: portfolio.placementReadinessScore,
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve portfolio' });
  }
});

/**
 * GET /api/portfolio (my portfolio)
 * Private portfolio view for the logged-in student
 * Requirements: 9.6
 */
router.get('/', authMiddleware, roleGuard([UserRole.STUDENT]), async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne({ studentId: req.user!.userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found. Complete an assessment to create one.' });
    }

    const studentProfile = await StudentProfile.findOne({ userId: req.user!.userId });

    res.json({
      success: true,
      message: 'Portfolio retrieved',
      data: {
        portfolio: {
          ...portfolio.toObject(),
          skills: studentProfile?.skills ?? [],
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve portfolio' });
  }
});

/**
 * PUT /api/portfolio/items/:itemId/verify
 * Verify a portfolio item (Institution_Admin or Industry_Partner)
 * Requirements: 9.3
 */
router.put(
  '/items/:itemId/verify',
  authMiddleware,
  roleGuard([UserRole.INSTITUTION, UserRole.INDUSTRY, UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      const { studentId, itemType, verificationLevel } = req.body;

      if (!studentId || !itemType || !verificationLevel) {
        return res.status(400).json({ success: false, message: 'studentId, itemType, and verificationLevel are required' });
      }

      const allowedLevels = [
        VerificationLevel.ASSESSMENT_VERIFIED,
        VerificationLevel.COURSE_VERIFIED,
        VerificationLevel.INDUSTRY_VERIFIED,
      ];
      if (!allowedLevels.includes(verificationLevel)) {
        return res.status(400).json({ success: false, message: 'Invalid verification level' });
      }

      if (itemType === 'skill') {
        // Update skill verification level (only increase)
        const levelOrder = Object.values(VerificationLevel);
        const profile = await StudentProfile.findOne({ userId: studentId });
        if (!profile) {
          return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const skill = profile.skills.find(s => String(s.skillId) === req.params.itemId);
        if (!skill) {
          return res.status(404).json({ success: false, message: 'Skill not found in profile' });
        }

        const currentIdx = levelOrder.indexOf(skill.verificationLevel);
        const newIdx = levelOrder.indexOf(verificationLevel);

        if (newIdx <= currentIdx) {
          return res.status(400).json({ success: false, message: 'Verification level can only be upgraded' });
        }

        skill.verificationLevel = verificationLevel;
        skill.verifiedBy = req.user!.userId as any;
        skill.verifiedAt = new Date();
        await profile.save();

        return res.json({ success: true, message: 'Skill verification updated' });
      }

      res.status(400).json({ success: false, message: 'Unsupported item type' });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to verify portfolio item' });
    }
  }
);

/**
 * POST /api/portfolio/projects
 * Add a project to portfolio (self-declared)
 * Requirements: 9.2
 */
router.post(
  '/projects',
  authMiddleware,
  roleGuard([UserRole.STUDENT]),
  async (req: Request, res: Response) => {
    try {
      const { title, description, techStack, url } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Project title is required' });
      }

      const portfolio = await Portfolio.findOne({ studentId: req.user!.userId });
      if (!portfolio) {
        return res.status(404).json({ success: false, message: 'Portfolio not found' });
      }

      portfolio.projects.push({
        title,
        description,
        techStack: techStack || [],
        url,
        verificationLevel: VerificationLevel.SELF_DECLARED,
      });

      await portfolio.save();
      res.status(201).json({ success: true, message: 'Project added', data: { portfolio } });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to add project' });
    }
  }
);

export default router;
