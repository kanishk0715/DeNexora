import express, { Request, Response } from 'express';
import Notification from '../models/Notification';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/notifications
 * Get notifications for current user
 * Requirements: 15.1, 15.3
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', unreadOnly } = req.query;
    const filter: Record<string, unknown> = { recipientId: req.user!.userId };
    if (unreadOnly === 'true') filter.isRead = false;

    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(String(limit))),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipientId: req.user!.userId, isRead: false }),
    ]);

    res.json({ success: true, message: 'Notifications retrieved', data: { notifications, total, unreadCount } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications' });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 * Requirements: 15.3
 */
router.put('/:id/read', authMiddleware, async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user!.userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification marked as read', data: { notification } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
router.put('/read-all', authMiddleware, async (req: Request, res: Response) => {
  try {
    await Notification.updateMany({ recipientId: req.user!.userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
});

export default router;
