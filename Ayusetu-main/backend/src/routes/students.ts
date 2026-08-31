import express, { Request, Response } from 'express';
import StudentProfile from '../models/StudentProfile';
import Portfolio from '../models/Portfolio';
import { authMiddleware } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { UserRole } from '../models/User';
import { computePlacementReadinessScore, normalizeCount } from '../lib/scoring';

const router = express.Router();

/**
 * GET /api/students/profile
 * Fetch logged-in student's full profile
 * Requirements: 7.5 (student version)
 */
router.get('/profile', authMiddleware, roleGuard([UserRole.STUDENT]), async (req: Request, res: Response) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user!.userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found. Please complete your profile.' });
    }
    res.json({ success: true, message: 'Profile retrieved', data: { profile } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
});

/**
 * POST /api/students/profile
 * Create student profile
 */
router.post('/profile', authMiddleware, roleGuard([UserRole.STUDENT]), async (req: Request, res: Response) => {
  try {
    const exists = await StudentProfile.findOne({ userId: req.user!.userId });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Profile already exists. Use PUT to update.' });
    }

    const { institution, department, branch, graduationYear, cgpa, careerInterests, targetIndustries, locationPreference } = req.body;

    if (!institution || !department || !branch || !graduationYear) {
      return res.status(400).json({ success: false, message: 'institution, department, branch, and graduationYear are required' });
    }

    const profile = await StudentProfile.create({
      userId: req.user!.userId,
      institution, department, branch,
      graduationYear: parseInt(graduationYear),
      cgpa: cgpa ? parseFloat(cgpa) : undefined,
      careerInterests: careerInterests || [],
      targetIndustries: targetIndustries || [],
      locationPreference,
    });

    // Create corresponding portfolio
    const slug = `${req.user!.userId}-${Date.now()}`;
    await Portfolio.create({
      studentId: req.user!.userId,
      publicSlug: slug,
    });

    res.status(201).json({ success: true, message: 'Profile created', data: { profile } });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.keys(err.errors).map(k => ({ field: k, message: err.errors[k].message })),
      });
    }
    res.status(500).json({ success: false, message: 'Failed to create profile' });
  }
});

/**
 * PUT /api/students/profile
 * Update student profile and career interests
 * Requirements: 3.4
 */
router.put('/profile', authMiddleware, roleGuard([UserRole.STUDENT]), async (req: Request, res: Response) => {
  try {
    const allowed = ['institution', 'department', 'branch', 'graduationYear', 'cgpa', 'careerInterests', 'targetIndustries', 'locationPreference'];
    const updates: Record<string, unknown> = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user!.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Recompute placement readiness
    const aptAvg = (profile.aptitudeScore.logicalReasoning + profile.aptitudeScore.quantitative + profile.aptitudeScore.verbal) / 3;
    const techSkills = profile.skills.filter(s => s.score > 0);
    const techAvg = techSkills.length > 0 ? techSkills.reduce((sum, s) => sum + s.score, 0) / techSkills.length : 0;

    profile.placementReadinessScore = computePlacementReadinessScore({
      technicalAvg: techAvg,
      softAvg: 60,
      aptitudeAvg: aptAvg,
      projectsCountNormalized: normalizeCount(profile.projects.length, 5),
      certificationsCountNormalized: 0,
      internshipExperienceScore: 0,
      resumeQualityScore: profile.resumeUrl ? 80 : 20,
    });
    await profile.save();

    res.json({ success: true, message: 'Profile updated', data: { profile } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

/**
 * GET /api/students/skill-gaps
 * Return current skill gaps with gap priority
 * Requirements: 2.9, 3.2
 */
router.get('/skill-gaps', authMiddleware, roleGuard([UserRole.STUDENT]), async (req: Request, res: Response) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user!.userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const Skill = require('../models/Skill').default;
    const gapReport = await Promise.all(
      profile.skills.map(async s => {
        const skill = await Skill.findById(s.skillId).select('industryBenchmark name');
        const required = skill?.industryBenchmark ?? 70;
        const gap = Math.max(0, required - s.score);
        let gapPriority = 'ready';
        if (gap > 40) gapPriority = 'major';
        else if (gap > 25) gapPriority = 'significant';
        else if (gap > 10) gapPriority = 'moderate';

        return { skillName: s.name, studentScore: s.score, requiredScore: required, gap, gapPriority };
      })
    );

    gapReport.sort((a, b) => b.gap - a.gap);

    res.json({ success: true, message: 'Skill gaps retrieved', data: { skillGaps: gapReport } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve skill gaps' });
  }
});

export default router;
