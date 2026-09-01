/**
 * AI Service proxy routes
 * Forwards requests to the Python AI service using axios (already a dependency)
 */

import express, { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// ── helpers ───────────────────────────────────────────────────────────────────

async function proxyJson(path: string, body: unknown, res: Response): Promise<void> {
  try {
    const { status, data } = await axios.post(`${AI_URL}${path}`, body);
    res.status(status).json(data);
  } catch (err: any) {
    const status = err?.response?.status ?? 502;
    const data = err?.response?.data ?? { success: false, message: 'AI service unavailable' };
    res.status(status).json(data);
  }
}

// ── Resume skill extraction ───────────────────────────────────────────────────

/**
 * POST /api/ai/extract-resume-skills
 * Multipart file upload → semantic + keyword skill extraction
 */
router.post(
  '/extract-resume-skills',
  authMiddleware,
  upload.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const useSemantic = req.query.use_semantic !== 'false';
    const threshold = parseFloat(String(req.query.confidence_threshold ?? '0.65'));

    try {
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const { status, data } = await axios.post(
        `${AI_URL}/ai/extract-resume-skills?use_semantic=${useSemantic}&confidence_threshold=${threshold}`,
        form,
        { headers: form.getHeaders() }
      );
      return res.status(status).json(data);
    } catch (err: any) {
      const status = err?.response?.status ?? 502;
      const data = err?.response?.data ?? { success: false, message: 'AI service unavailable' };
      return res.status(status).json(data);
    }
  }
);

// ── Semantic skill matching ───────────────────────────────────────────────────

/** POST /api/ai/semantic-skill-match */
router.post('/semantic-skill-match', authMiddleware, async (req: Request, res: Response) => {
  await proxyJson('/ai/semantic-skill-match', req.body, res);
});

// ── Skill relationships ───────────────────────────────────────────────────────

/** POST /api/ai/skill-relationships */
router.post('/skill-relationships', authMiddleware, async (req: Request, res: Response) => {
  await proxyJson('/ai/skill-relationships', req.body, res);
});

// ── Semantic profile matching ─────────────────────────────────────────────────

/** POST /api/ai/semantic-profile-match */
router.post('/semantic-profile-match', authMiddleware, async (req: Request, res: Response) => {
  await proxyJson('/ai/semantic-profile-match', req.body, res);
});

// ── Similarity ────────────────────────────────────────────────────────────────

/** POST /api/ai/compute-similarity  body: { text1, text2 } */
router.post('/compute-similarity', authMiddleware, async (req: Request, res: Response) => {
  const { text1, text2 } = req.body;
  if (!text1 || !text2) {
    return res.status(400).json({ success: false, message: 'text1 and text2 are required' });
  }
  try {
    const { status, data } = await axios.post(
      `${AI_URL}/ai/compute-similarity?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`
    );
    return res.status(status).json(data);
  } catch (err: any) {
    const status = err?.response?.status ?? 502;
    return res.status(status).json(err?.response?.data ?? { success: false, message: 'AI service unavailable' });
  }
});

// ── Full pipeline endpoints ───────────────────────────────────────────────────

/** POST /api/ai/analyze-skills */
router.post('/analyze-skills', authMiddleware, async (req: Request, res: Response) => {
  await proxyJson('/ai/analyze-skills', req.body, res);
});

/** POST /api/ai/match-score */
router.post('/match-score', authMiddleware, async (req: Request, res: Response) => {
  await proxyJson('/ai/match-score', req.body, res);
});

/** POST /api/ai/recommendations */
router.post('/recommendations', authMiddleware, async (req: Request, res: Response) => {
  await proxyJson('/ai/recommendations', req.body, res);
});

export default router;
