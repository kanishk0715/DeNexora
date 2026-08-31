import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

/**
 * Role-based authorization middleware factory
 * Creates middleware that checks if authenticated user has one of the permitted roles
 * 
 * Requirements: 1.3, 1.4
 * 
 * @param permittedRoles - Array of roles that are allowed to access the route
 * @returns Express middleware function
 * 
 * @example
 * // Allow only industry partners
 * router.post('/opportunities', authMiddleware, roleGuard([UserRole.INDUSTRY]), createOpportunity);
 * 
 * @example
 * // Allow multiple roles
 * router.get('/analytics', authMiddleware, roleGuard([UserRole.INSTITUTION, UserRole.ADMIN]), getAnalytics);
 */
export const roleGuard = (permittedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user is authenticated (should be set by authMiddleware)
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // Check if user's role is in the permitted list
    if (!permittedRoles.includes(req.user.role)) {
      // Requirement 1.4: Deny access with authorization error without exposing system internals
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
      return;
    }

    // User has required role, proceed to next middleware/handler
    next();
  };
};
