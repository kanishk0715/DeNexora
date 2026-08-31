import { ResponseBuilder, ApiResponse } from './apiResponse';

describe('ResponseBuilder', () => {
  describe('success', () => {
    it('should create a success response with data', () => {
      const result: ApiResponse<{ id: number }> = ResponseBuilder.success('Operation successful', {
        id: 123,
      });

      expect(result).toEqual({
        success: true,
        message: 'Operation successful',
        data: { id: 123 },
      });
    });

    it('should create a success response without data', () => {
      const result = ResponseBuilder.success('Operation successful');

      expect(result).toEqual({
        success: true,
        message: 'Operation successful',
        data: undefined,
      });
    });
  });

  describe('error', () => {
    it('should create an error response with errors array', () => {
      const result = ResponseBuilder.error('Something went wrong', [
        { field: 'email', message: 'Invalid email' },
      ]);

      expect(result).toEqual({
        success: false,
        message: 'Something went wrong',
        errors: [{ field: 'email', message: 'Invalid email' }],
      });
    });

    it('should create an error response without errors array', () => {
      const result = ResponseBuilder.error('Something went wrong');

      expect(result).toEqual({
        success: false,
        message: 'Something went wrong',
        errors: undefined,
      });
    });
  });

  describe('validationError', () => {
    it('should create a validation error response', () => {
      const errors = [
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password must be at least 8 characters' },
      ];

      const result = ResponseBuilder.validationError(errors);

      expect(result).toEqual({
        success: false,
        message: 'Validation failed',
        errors,
      });
    });
  });
});
