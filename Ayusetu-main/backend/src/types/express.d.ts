import { JWTPayload } from '../utils/jwt';

/**
 * Extend Express Request type to include user from JWT
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export {};
