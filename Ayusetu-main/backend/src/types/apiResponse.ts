/**
 * Standard API response envelope for all endpoints
 * Ensures consistent response structure across the platform
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

export class ResponseBuilder {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, errors?: Array<{ field?: string; message: string }>): ApiResponse {
    return {
      success: false,
      message,
      errors,
    };
  }

  static validationError(
    errors: Array<{ field: string; message: string }>
  ): ApiResponse {
    return {
      success: false,
      message: 'Validation failed',
      errors,
    };
  }
}
