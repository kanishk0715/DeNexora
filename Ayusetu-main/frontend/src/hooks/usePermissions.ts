import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/api';

/**
 * Permission definitions for each role
 */
const PERMISSIONS: Record<User['role'], Set<string>> = {
  student: new Set([
    'view:assessments',
    'create:portfolio',
    'view:opportunities',
    'create:applications',
    'view:skills',
    'view:exams-schemes',
    'edit:profile',
  ]),
  academician: new Set([
    'view:opportunities',
    'view:fdp',
    'view:research',
    'create:applications',
    'edit:profile',
  ]),
  industry: new Set([
    'create:opportunities',
    'view:applications',
    'manage:applicants',
    'view:programs',
    'edit:profile',
  ]),
  institution: new Set([
    'view:analytics',
    'view:students',
    'view:placements',
    'manage:students',
    'view:reports',
    'edit:profile',
  ]),
  admin: new Set([
    'view:all',
    'manage:users',
    'manage:verifications',
    'view:platform-analytics',
    'manage:system',
    'edit:all',
  ]),
};

/**
 * Hook to check user permissions
 */
export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = PERMISSIONS[user.role];
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    return userPermissions?.has(permission) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccessRoute = (allowedRoles: User['role'][]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    userRole: user?.role,
  };
}
