import express, { Request, Response } from 'express';
import { Assessment, AssessmentResult } from '../models/Assessment';
import StudentProfile from '../models/StudentProfile';
import { VerificationLevel } from '../models/StudentProfile';
import { computeSkillGap } from '../lib/scoring';
import { authMiddleware } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { UserRole } from '../models/User';
import Skill from '../models/Skill';

const router = express.Router();

/**
 * GET /api/assessments
 * List all active assessments
 * Requirements: 2.1
 */
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const assessments = await Assessment.find({ isActive: true }).select(
      'title category durationMinutes questions._id'
    );
    return res.json({ success: true, message: 'Assessments retrieved', data: { assessments } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to retrieve assessments' });
  }
});

/**
 * GET /api/assessments/:id
 * Fetch assessment questions (without correct answers)
 * Requirements: 2.1
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment || !assessment.isActive) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Strip correct answers before sending to student
    const sanitized = {
      _id: assessment._id,
      title: assessment.title,
      category: assessment.category,
      durationMinutes: assessment.durationMinutes,
      questions: assessment.questions.map(q => ({
        questionId: q.questionId,
        text: q.text,
        options: q.options,
        skillId: q.skillId,
        difficulty: q.difficulty,
        isAdaptive: q.isAdaptive,
      })),
    };

    res.json({ success: true, message: 'Assessment retrieved', data: { assessment: sanitized } });
    return;
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to retrieve assessment' });
  }
});

/**
 * POST /api/assessments/:id/submit
 * Submit assessment answers and compute Skill_Profile
 * Requirements: 2.2, 2.4, 2.5, 2.6
 */
router.post(
  '/:id/submit',
  authMiddleware,
  roleGuard([UserRole.STUDENT]),
  async (req: Request, res: Response) => {
    try {
      const assessment = await Assessment.findById(req.params.id);
      if (!assessment || !assessment.isActive) {
        return res.status(404).json({ success: false, message: 'Assessment not found' });
      }

      const { answers } = req.body; // { questionId: string, selectedOption: number }[]
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ success: false, message: 'Answers array is required' });
      }

      // Validate all mandatory questions are answered (Requirement 2.6)
      const answeredIds = new Set(answers.map((a: any) => String(a.questionId)));
      const unanswered = assessment.questions
        .filter(q => !answeredIds.has(String(q.questionId)))
        .map(q => q.questionId);

      if (unanswered.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'All questions must be answered',
          errors: unanswered.map(id => ({ field: String(id), message: 'This question is required' })),
        });
      }

      // Build answer lookup
      const answerMap = new Map(
        answers.map((a: any) => [String(a.questionId), Number(a.selectedOption)])
      );

      // Group scores by skill
      const skillScoreMap = new Map<string, { skillId: any; skillName: string; correct: number; total: number }>();

      for (const q of assessment.questions) {
        const qId = String(q.questionId);
        const selected = answerMap.get(qId);
        const isCorrect = selected === q.correctAnswer;

        const skillKey = String(q.skillId);
        if (!skillScoreMap.has(skillKey)) {
          // Fetch skill name
          const skill = await Skill.findById(q.skillId).select('name industryBenchmark');
          skillScoreMap.set(skillKey, {
            skillId: q.skillId,
            skillName: skill?.name ?? skillKey,
            correct: 0,
            total: 0,
          });
        }

        const entry = skillScoreMap.get(skillKey)!;
        entry.total += 1;
        if (isCorrect) entry.correct += 1;
      }

      // Compute per-skill scores and gaps
      const skillScores = [];
      for (const [, entry] of skillScoreMap) {
        const score = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
        const skill = await Skill.findById(entry.skillId).select('industryBenchmark');
        const benchmark = skill?.industryBenchmark ?? 70;
        const { gap, gapPriority } = computeSkillGap(benchmark, score);

        skillScores.push({
          skillId: entry.skillId,
          skillName: entry.skillName,
          score,
          gap,
          gapPriority,
        });
      }

      const totalScore =
        skillScores.length > 0
          ? Math.round(skillScores.reduce((sum, s) => sum + s.score, 0) / skillScores.length)
          : 0;

      const studentId = req.user!.userId;

      // Mark previous results inactive (Requirement 2.4, 2.5)
      await AssessmentResult.updateMany(
        { studentId, assessmentId: assessment._id },
        { isActive: false }
      );

      // Save new result
      const result = await AssessmentResult.create({
        studentId,
        assessmentId: assessment._id,
        totalScore,
        skillScores,
        isActive: true,
        completedAt: new Date(),
      });

      // Update student profile skills with assessment-verified scores
      await StudentProfile.updateOne(
        { userId: studentId },
        {
          $set: {
            skills: skillScores.map(s => ({
              skillId: s.skillId,
              name: s.skillName,
              score: s.score,
              verificationLevel: VerificationLevel.ASSESSMENT_VERIFIED,
              verifiedAt: new Date(),
            })),
          },
        },
        { upsert: false }
      );

      return res.json({
        success: true,
        message: 'Assessment submitted successfully',
        data: { result },
      });
    } catch (err) {
      console.error('Assessment submit error:', err);
      return res.status(500).json({ success: false, message: 'Failed to submit assessment' });
    }
  }
);

/**
 * GET /api/assessments/results/:studentId
 * Fetch assessment history for a student
 * Requirements: 2.4
 */
router.get(
  '/results/:studentId',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;

      // Students can only see their own results; admins/institutions can see any
      const requestingUser = req.user!;
      if (
        requestingUser.role === UserRole.STUDENT &&
        requestingUser.userId !== studentId
      ) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const results = await AssessmentResult.find({ studentId }).sort({ completedAt: -1 });
      return res.json({ success: true, message: 'Results retrieved', data: { results } });
    } catch {
      return res.status(500).json({ success: false, message: 'Failed to retrieve results' });
    }
  }
);

export default router;
