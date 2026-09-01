import { Request, Response, NextFunction } from 'express';
import AuditLog, { AuditAction } from '../models/AuditLog';

/**
 * Audit logging middleware for sensitive operations
 * Tracks who accessed what, when, and from where
 */
export const auditLogger = (action: AuditAction, entityType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only log if user is authenticated
      if (req.user) {
        const entityId = req.params.id || req.body.id || req.body._id;

        // Create audit log entry
        await AuditLog.create({
          userId: req.user.id,
          action,
          entityType,
          entityId: entityId || new Date().getTime().toString(), // Fallback for non-ID operations
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent'),
          timestamp: new Date(),
        });
      }
    } catch (error) {
      // Log error but don't block the request
      console.error('Audit logging failed:', error);
    }

    next();
  };
};

/**
 * Utility function to manually log audit events
 */
export const logAudit = async (
  userId: string,
  action: AuditAction,
  entityType: string,
  entityId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Manual audit logging failed:', error);
  }
};

/**
 * Get audit logs for a specific user
 */
export const getUserAuditLogs = async (userId: string, limit: number = 50) => {
  return await AuditLog.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'name email role');
};

/**
 * Get audit logs for a specific entity
 */
export const getEntityAuditLogs = async (entityId: string, limit: number = 50) => {
  return await AuditLog.find({ entityId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'name email role');
};
