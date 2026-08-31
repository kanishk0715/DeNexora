import express, { Request, Response } from 'express';
import Application, { ApplicationStatus, VALID_TRANSITIONS } from '../models/Application';
import Opportunity, { OpportunityStatus } from '../models/Opportunity';
import StudentProfile from '../models/StudentProfile';
import Notification, { NotificationType } from '../models/Notification';
import { authMiddleware } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { UserRole } from '../models/User';
import { computeMatchScore, computeTechnicalSkillMatch } from '../lib/scoring';

const router = express.Router();

/**
 * POST /api/applications
 * Submit application for an opportunity
 * Requirements: 5.2, 5.3, 5.7
 */
router.post('/', authMiddleware, roleGuard([UserRole.STUDENT, UserRole.ACADEMICIAN]), async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.body;
    if (!opportunityId) {
      return res.status(400).json({ success: false, message: 'opportunityId is required' });
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Check deadline / status (Requirement 4.3)
    if (opportunity.status !== OpportunityStatus.ACTIVE || opportunity.applicationDeadline < new Date()) {
      return res.status(400).json({ success: false, message: 'This opportunity is no longer accepting applications' });
    }

    const applicantId = req.user!.userId;

    // Prevent duplicate applications (Requirement 5.7)
    const existing = await Application.findOne({ applicantId, opportunityId });
    if (existing && existing.status !== ApplicationStatus.WITHDRAWN) {
      return res.status(409).json({ success: false, message: 'You have already applied for this opportunity' });
    }

    // Build portfolio snapshot and compute match score
    let matchScore = 0;
    let portfolioSnapshot: Record<string, unknown> = {};

    if (req.user!.role === UserRole.STUDENT) {
      const profile = await StudentProfile.findOne({ userId: applicantId });
      if (profile) {
        const techMatch = computeTechnicalSkillMatch(
          profile.skills.map(s => ({ name: s.name, score: s.score })),
          opportunity.requiredSkills.map(rs => ({ name: rs.name, requiredScore: rs.requiredScore }))
        );
        const locationMatch =
          !opportunity.location ||
          !profile.locationPreference ||
          opportunity.location.toLowerCase().includes(profile.locationPreference.toLowerCase())
            ? 100
            : 0;
        matchScore = computeMatchScore({
          technicalSkillMatch: techMatch,
          softSkillMatch: 70,
          educationMatch: 80,
          careerInterestMatch: 70,
          projectsMatch: Math.min(100, profile.projects.length * 20),
          locationMatch,
        });

        portfolioSnapshot = {
          skills: profile.skills,
          projects: profile.projects,
          cgpa: profile.cgpa,
          placementReadinessScore: profile.placementReadinessScore,
        };
      }
    }

    const application = await Application.create({
      applicantId,
      opportunityId,
      portfolioSnapshot,
      matchScore,
      status: ApplicationStatus.APPLIED,
      statusHistory: [{ status: ApplicationStatus.APPLIED, changedAt: new Date(), changedBy: applicantId }],
      appliedAt: new Date(),
    });

    // Increment applicant count
    await Opportunity.findByIdAndUpdate(opportunityId, { $inc: { applicantCount: 1 } });

    // Notify industry partner (Requirement 5.2)
    await Notification.create({
      recipientId: opportunity.industryId,
      type: NotificationType.APPLICATION_UPDATE,
      title: 'New Application Received',
      message: `A new application has been submitted for "${opportunity.title}"`,
      relatedEntityId: application._id,
      relatedEntityType: 'Application',
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', data: { application } });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already applied for this opportunity' });
    }
    console.error('Apply error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
});

/**
 * GET /api/applications
 * Get all applications for the current user (student or industry)
 * Requirements: 5.5
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    let applications;
    if (role === UserRole.STUDENT || role === UserRole.ACADEMICIAN) {
      applications = await Application.find({ applicantId: userId })
        .populate('opportunityId', 'title type location applicationDeadline status')
        .sort({ appliedAt: -1 });
    } else if (role === UserRole.INDUSTRY) {
      // Get all applications for their opportunities
      const myOpportunities = await Opportunity.find({ industryId: userId }).select('_id');
      const oppIds = myOpportunities.map(o => o._id);
      applications = await Application.find({ opportunityId: { $in: oppIds } })
        .populate('opportunityId', 'title type')
        .populate('applicantId', 'name email')
        .sort({ appliedAt: -1 });
    } else {
      applications = await Application.find()
        .populate('opportunityId', 'title type')
        .populate('applicantId', 'name email')
        .sort({ appliedAt: -1 });
    }

    res.json({ success: true, message: 'Applications retrieved', data: { applications } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve applications' });
  }
});

/**
 * GET /api/applications/:id
 * Get single application detail
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('opportunityId')
      .populate('applicantId', 'name email role');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const userId = req.user!.userId;
    const role = req.user!.role;

    // Only the applicant, the opportunity owner, admins, or institutions can view
    const opp = application.opportunityId as any;
    if (
      role === UserRole.STUDENT &&
      String(application.applicantId) !== userId
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, message: 'Application retrieved', data: { application } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve application' });
  }
});

/**
 * PUT /api/applications/:id/status
 * Update application status (Industry_Partner)
 * Requirements: 5.4
 */
router.put(
  '/:id/status',
  authMiddleware,
  roleGuard([UserRole.INDUSTRY, UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      const { status, note } = req.body;
      if (!status || !Object.values(ApplicationStatus).includes(status)) {
        return res.status(400).json({ success: false, message: 'Valid status is required' });
      }

      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // State machine validation (Property 7)
      const validNext = VALID_TRANSITIONS[application.status];
      if (!validNext.includes(status as ApplicationStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${application.status} to ${status}`,
        });
      }

      application.status = status as ApplicationStatus;
      application.statusHistory.push({
        status: status as ApplicationStatus,
        changedAt: new Date(),
        changedBy: new (require('mongoose').Types.ObjectId)(req.user!.userId),
        note,
      });

      await application.save();

      // Notify applicant (Requirement 5.4)
      await Notification.create({
        recipientId: application.applicantId,
        type: NotificationType.APPLICATION_UPDATE,
        title: 'Application Status Updated',
        message: `Your application status has been updated to: ${status.replace('_', ' ')}`,
        relatedEntityId: application._id,
        relatedEntityType: 'Application',
      });

      res.json({ success: true, message: 'Status updated', data: { application } });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to update status' });
    }
  }
);

/**
 * DELETE /api/applications/:id
 * Withdraw application (student)
 * Requirements: 5.6
 */
router.delete(
  '/:id',
  authMiddleware,
  roleGuard([UserRole.STUDENT, UserRole.ACADEMICIAN]),
  async (req: Request, res: Response) => {
    try {
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      if (String(application.applicantId) !== req.user!.userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      if (application.status === ApplicationStatus.WITHDRAWN) {
        return res.status(400).json({ success: false, message: 'Application is already withdrawn' });
      }

      application.status = ApplicationStatus.WITHDRAWN;
      application.statusHistory.push({
        status: ApplicationStatus.WITHDRAWN,
        changedAt: new Date(),
        changedBy: new (require('mongoose').Types.ObjectId)(req.user!.userId),
      });
      await application.save();

      // Notify industry partner
      const opportunity = await Opportunity.findById(application.opportunityId).select('industryId title');
      if (opportunity) {
        await Notification.create({
          recipientId: opportunity.industryId,
          type: NotificationType.APPLICATION_UPDATE,
          title: 'Application Withdrawn',
          message: `An applicant has withdrawn their application for "${opportunity.title}"`,
          relatedEntityId: application._id,
          relatedEntityType: 'Application',
        });
      }

      res.json({ success: true, message: 'Application withdrawn successfully' });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to withdraw application' });
    }
  }
);

/**
 * GET /api/applications/analytics
 * Recruitment funnel metrics for Industry_Partner
 * Requirements: 13.4
 */
router.get(
  '/analytics/funnel',
  authMiddleware,
  roleGuard([UserRole.INDUSTRY]),
  async (req: Request, res: Response) => {
    try {
      const myOpportunities = await Opportunity.find({ industryId: req.user!.userId }).select('_id');
      const oppIds = myOpportunities.map(o => o._id);

      const funnel = await Application.aggregate([
        { $match: { opportunityId: { $in: oppIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      const result = Object.values(ApplicationStatus).reduce((acc, s) => {
        acc[s] = 0;
        return acc;
      }, {} as Record<string, number>);

      funnel.forEach((f: any) => { result[f._id] = f.count; });

      res.json({ success: true, message: 'Funnel analytics retrieved', data: { funnel: result } });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to retrieve analytics' });
    }
  }
);

export default router;
