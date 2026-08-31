import { Request, Response, NextFunction } from 'express';
import { roleGuard } from './roleGuard';
import { UserRole } from '../models/User';
import { JWTPayload } from '../utils/jwt';

// Helper to build a mock Express request
const mockRequest = (user?: JWTPayload): Partial<Request> => ({ user });

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const next: NextFunction = jest.fn();

const makeUser = (role: UserRole): JWTPayload => ({
  userId: 'abc123',
  email: 'user@example.com',
  role,
});

describe('roleGuard middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('unauthenticated requests', () => {
    it('returns 401 when req.user is undefined', () => {
      const req = mockRequest(undefined) as Request;
      const res = mockResponse();

      roleGuard([UserRole.STUDENT])(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect((res.json as jest.Mock).mock.calls[0][0]).toMatchObject({
        success: false,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('single permitted role', () => {
    it('calls next() when user role matches the single permitted role', () => {
      const req = mockRequest(makeUser(UserRole.INDUSTRY)) as Request;
      const res = mockResponse();

      roleGuard([UserRole.INDUSTRY])(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('returns 403 when user role does not match the single permitted role', () => {
      const req = mockRequest(makeUser(UserRole.STUDENT)) as Request;
      const res = mockResponse();

      roleGuard([UserRole.INDUSTRY])(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect((res.json as jest.Mock).mock.calls[0][0]).toMatchObject({
        success: false,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('multiple permitted roles', () => {
    const permitted = [UserRole.INSTITUTION, UserRole.ADMIN];

    it.each(permitted)(
      'calls next() for permitted role: %s',
      (role) => {
        const req = mockRequest(makeUser(role)) as Request;
        const res = mockResponse();

        roleGuard(permitted)(req, res, next);

        expect(next).toHaveBeenCalled();
      }
    );

    it('returns 403 for a role not in the permitted array', () => {
      const req = mockRequest(makeUser(UserRole.STUDENT)) as Request;
      const res = mockResponse();

      roleGuard(permitted)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('all roles permitted', () => {
    it('calls next() for every valid role when all roles are permitted', () => {
      const allRoles = Object.values(UserRole);

      allRoles.forEach((role) => {
        jest.clearAllMocks();
        const req = mockRequest(makeUser(role)) as Request;
        const res = mockResponse();

        roleGuard(allRoles)(req, res, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe('empty permitted roles array', () => {
    it('returns 403 for any authenticated user when no roles are permitted', () => {
      const req = mockRequest(makeUser(UserRole.ADMIN)) as Request;
      const res = mockResponse();

      roleGuard([])(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('response does not expose system internals (Requirement 1.4)', () => {
    it('403 response message does not contain stack traces or internal details', () => {
      const req = mockRequest(makeUser(UserRole.STUDENT)) as Request;
      const res = mockResponse();

      roleGuard([UserRole.INDUSTRY])(req, res, next);

      const body = (res.json as jest.Mock).mock.calls[0][0];
      expect(JSON.stringify(body)).not.toMatch(/stack|trace|internal|Error/i);
    });
  });
});
