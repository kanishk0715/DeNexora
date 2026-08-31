import express, { Request, Response } from 'express';
import Opportunity, { OpportunityStatus, OpportunityType, TargetAudience } from '../models/Opportunity';
import Application, { ApplicationStatus } from '../models/Application';
import Notification, { NotificationType } from '../models/Notification';
import { authMiddleware } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { UserRole } from '../models/User';
import StudentProfile from '../models/StudentProfile';
import { computeMatchScore, computeTechnicalSkillMatch } from '../lib/scoring';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * Auto-close opportunities whose deadline has passed (Requirement 4.3).
 * Called internally before returning opportunities to clients.
 */
async function autoCloseExpiredOpportunities(ids: mongoose.Types.ObjectId[]): Promise<void> {
  if (ids.length === 0) return;
  await Opportunity.updateMany(
    {
      _id: { $in: ids },
      status: OpportunityStatus.ACTIVE,
      applicationDeadline: { $lt: new Date() },
    },
    { $set: { status: OpportunityStatus.CLOSED } }
  );
}

/**
 * GET /api/opportunities
 * List opportunities (auth required) — basic list.
 * Search/filter by skill, type, location, workMode, audience ordered by match score is task 6.2.
 * Requirements: 4.3, 5.1
 */
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      skill,
      type,
      location,
      workMode,
      targetAudience,
      page = '1',
      limit = '20',
    } = req.query;

    const filter: Record<string, unknown> = {
      status: { $in: [OpportunityStatus.ACTIVE, OpportunityStatus.CLOSED] },
    };

    if (type) filter.type = type;
    if (location) filter.location = new RegExp(String(location), 'i');
    if (workMode) filter.workMode = workMode;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (skill) filter['requiredSkills.name'] = new RegExp(String(skill), 'i');

    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const opportunities = await Opportunity.find(filter)
      .skip(skip)
      .limit(parseInt(String(limit)))
      .sort({ createdAt: -1 });

    // Auto-close expired opportunities before returning (Requirement 4.3)
    const activeIds = opportunities
      .filter(o => o.status === OpportunityStatus.ACTIVE && o.applicationDeadline < new Date())
      .map(o => o._id as mongoose.Types.ObjectId);
    await autoCloseExpiredOpportunities(activeIds);

    // Reload if any were auto-closed
    const finalOpportunities = activeIds.length > 0
      ? await Opportunity.find(filter).skip(skip).limit(parseInt(String(limit))).sort({ createdAt: -1 })
      : opportunities;

    // Compute match scores if student (task 6.2 full implementation)
    let results: unknown[] = finalOpportunities;
    if (req.user?.role === UserRole.STUDENT) {
      const profile = await StudentProfile.findOne({ userId: req.user.userId });
      if (profile) {
        results = finalOpportunities.map(opp => {
          const techMatch = computeTechnicalSkillMatch(
            profile.skills.map(s => ({ name: s.name, score: s.score })),
            opp.requiredSkills.map(rs => ({ name: rs.name, requiredScore: rs.requiredScore }))
          );
          const locationMatch =
            !opp.location ||
            !profile.locationPreference ||
            opp.location.toLowerCase().includes(profile.locationPreference.toLowerCase())
              ? 100
              : 0;
          const careerMatch = profile.careerInterests.some(ci =>
            opp.title.toLowerCase().includes(ci.toLowerCase())
          )
            ? 100
            : 50;

          const matchScore = computeMatchScore({
            technicalSkillMatch: techMatch,
            softSkillMatch: 70,
            educationMatch: 80,
            careerInterestMatch: careerMatch,
            projectsMatch: 70,
            locationMatch,
          });

          return { ...opp.toObject(), matchScore };
        });

        (results as any[]).sort((a, b) => b.matchScore - a.matchScore);
      }
    }

    const total = await Opportunity.countDocuments(filter);

    res.json({
      success: true,
      message: 'Opportunities retrieved',
      data: { opportunities: results, total, page: parseInt(String(page)), limit: parseInt(String(limit)) },
    });
  } catch (err) {
    console.error('Get opportunities error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve opportunities' });
  }
});

/**
 * GET /api/opportunities/:id
 * Get single opportunity detail (auth required).
 * Also auto-closes the opportunity if its deadline has passed (Requirement 4.3).
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      res.status(404).json({ success: false, message: 'Opportunity not found' });
      return;
    }

    // Auto-close if deadline has passed (Requirement 4.3)
    if (
      opportunity.status === OpportunityStatus.ACTIVE &&
      opportunity.applicationDeadline < new Date()
    ) {
      opportunity.status = OpportunityStatus.CLOSED;
      await opportunity.save();
    }

    res.json({ success: true, message: 'Opportunity retrieved', data: { opportunity } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve opportunity' });
  }
});

/**
 * POST /api/opportunities
 * Create opportunity (Industry_Partner only).
 * Validates required fields per Requirement 4.2:
 *   title, type, requiredSkills, duration, numberOfPositions, applicationDeadline
 */
router.post(
  '/',
  authMiddleware,
  roleGuard([UserRole.INDUSTRY]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        title, type, targetAudience, description, requiredSkills,
        eligibilityCriteria, duration, stipend, location, workMode,
        numberOfPositions, applicationDeadline,
      } = req.body;

      // Validate required fields (Requirement 4.2)
      const missing: string[] = [];
      if (!title) missing.push('title');
      if (!type) missing.push('type');
      if (!duration) missing.push('duration');
      if (!numberOfPositions) missing.push('numberOfPositions');
      if (!applicationDeadline) missing.push('applicationDeadline');
      // requiredSkills must be a non-empty array (Requirement 4.2)
      if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
        missing.push('requiredSkills');
      }

      if (missing.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields',
          errors: missing.map(f => ({ field: f, message: `${f} is required` })),
        });
        return;
      }

      if (!Object.values(OpportunityType).includes(type)) {
        res.status(400).json({ success: false, message: 'Invalid opportunity type' });
        return;
      }

      const opportunity = await Opportunity.create({
        industryId: req.user!.userId,
        title, type,
        targetAudience: targetAudience || TargetAudience.STUDENT,
        description: description || '',
        requiredSkills,
        eligibilityCriteria: eligibilityCriteria || {},
        duration, stipend, location,
        workMode: workMode || 'onsite',
        numberOfPositions,
        applicationDeadline: new Date(applicationDeadline),
        status: OpportunityStatus.ACTIVE,
      });

      res.status(201).json({
        success: true,
        message: 'Opportunity created successfully',
        data: { opportunity },
      });
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: Object.keys(err.errors).map(k => ({ field: k, message: err.errors[k].message })),
        });
        return;
      }
      console.error('Create opportunity error:', err);
      res.status(500).json({ success: false, message: 'Failed to create opportunity' });
    }
  }
);

/**
 * PUT /api/opportunities/:id
 * Update opportunity (owner Industry_Partner only).
 * Notifies all existing applicants of material changes (Requirement 4.4).
 */
router.put(
  '/:id',
  authMiddleware,
  roleGuard([UserRole.INDUSTRY]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);
      if (!opportunity) {
        res.status(404).json({ success: false, message: 'Opportunity not found' });
        return;
      }
      if (String(opportunity.industryId) !== req.user!.userId) {
        res.status(403).json({ success: false, message: 'Not authorized' });
        return;
      }
      if (opportunity.status === OpportunityStatus.WITHDRAWN) {
        res.status(400).json({ success: false, message: 'Cannot edit a withdrawn opportunity' });
        return;
      }

      const allowedUpdates = [
        'title', 'description', 'requiredSkills', 'eligibilityCriteria',
        'duration', 'stipend', 'location', 'workMode', 'numberOfPositions', 'applicationDeadline',
      ];
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) (opportunity as any)[field] = req.body[field];
      });

      await opportunity.save();

      // Notify all existing applicants of the material change (Requirement 4.4)
      const applications = await Application.find({
        opportunityId: opportunity._id,
        status: { $nin: [ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED] },
      }).select('applicantId');

      if (applications.length > 0) {
        const notifications = applications.map(app => ({
          recipientId: app.applicantId,
          type: NotificationType.APPLICATION_UPDATE,
          title: 'Opportunity Updated',
          message: `The opportunity "${opportunity.title}" you applied to has been updated. Please review the new details.`,
          relatedEntityId: opportunity._id as mongoose.Types.ObjectId,
          relatedEntityType: 'Opportunity',
        }));
        await Notification.insertMany(notifications);
      }

      res.json({ success: true, message: 'Opportunity updated', data: { opportunity } });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to update opportunity' });
    }
  }
);

/**
 * DELETE /api/opportunities/:id
 * Withdraw opportunity (owner only).
 * Sets status to withdrawn and notifies all applicants (Requirement 4.5).
 */
router.delete(
  '/:id',
  authMiddleware,
  roleGuard([UserRole.INDUSTRY]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);
      if (!opportunity) {
        res.status(404).json({ success: false, message: 'Opportunity not found' });
        return;
      }
      if (String(opportunity.industryId) !== req.user!.userId) {
        res.status(403).json({ success: false, message: 'Not authorized' });
        return;
      }

      opportunity.status = OpportunityStatus.WITHDRAWN;
      await opportunity.save();

      // Notify all applicants of the cancellation (Requirement 4.5)
      const applications = await Application.find({
        opportunityId: opportunity._id,
        status: { $nin: [ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED] },
      }).select('applicantId');

      if (applications.length > 0) {
        const notifications = applications.map(app => ({
          recipientId: app.applicantId,
          type: NotificationType.APPLICATION_UPDATE,
          title: 'Opportunity Withdrawn',
          message: `The opportunity "${opportunity.title}" has been withdrawn by the company. Your application has been cancelled.`,
          relatedEntityId: opportunity._id as mongoose.Types.ObjectId,
          relatedEntityType: 'Opportunity',
        }));
        await Notification.insertMany(notifications);
      }

      res.json({ success: true, message: 'Opportunity withdrawn successfully' });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to withdraw opportunity' });
    }
  }
);

export default router;
