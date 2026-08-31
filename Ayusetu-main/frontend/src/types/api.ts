/**
 * Shared API response types matching backend envelope
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'academician' | 'industry' | 'institution' | 'admin';
  isEmailVerified: boolean;
  profileImageUrl?: string;
}
