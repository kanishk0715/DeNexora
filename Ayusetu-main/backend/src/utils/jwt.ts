import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

/**
 * JWT payload interface
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Generate JWT token for authenticated user
 * @param payload - User information to encode in token
 * @returns Signed JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded JWT payload
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret) as JWTPayload;
};

/**
 * Generate random token for email verification and password reset
 * @returns Random hex string
 */
export const generateRandomToken = (): string => {
  return require('crypto').randomBytes(32).toString('hex');
};
