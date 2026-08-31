import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import User, { UserRole } from '../models/User';
import { generateToken, generateRandomToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * Rate limiter for auth endpoints
 * Requirements: 1.8, 17.5
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registration attempts per hour
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.',
  },
});

/**
 * POST /api/auth/register
 * Register a new user
 * Requirements: 1.1, 1.2, 1.9
 */
router.post('/register', registerLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, organizationId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        errors: [
          { field: 'name', message: !name ? 'Name is required' : undefined },
          { field: 'email', message: !email ? 'Email is required' : undefined },
          { field: 'password', message: !password ? 'Password is required' : undefined },
          { field: 'role', message: !role ? 'Role is required' : undefined },
        ].filter(e => e.message),
      });
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
        errors: [{ field: 'role', message: 'Role must be one of: student, academician, industry, institution, admin' }],
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
        errors: [{ field: 'password', message: 'Password must be at least 8 characters long' }],
      });
    }

    // Check if user already exists (Requirement 1.2)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already registered',
        errors: [{ field: 'email', message: 'This email is already in use' }],
      });
    }

    // Generate email verification token
    const emailVerificationToken = generateRandomToken();

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed by pre-save hook
      role,
      phone,
      organizationId,
      emailVerificationToken,
      isEmailVerified: process.env.NODE_ENV === 'development',
      // Industry partners require organization verification (Requirement 1.9)
      isOrganizationVerified: role !== UserRole.INDUSTRY,
    });

    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, emailVerificationToken);
    
    if (!emailSent) {
      console.warn(`Failed to send verification email to ${user.email}`);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
    });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify user email address
 * Requirements: 1.3
 */
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Find user with this verification token
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
      data: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during email verification',
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * Requirements: 1.5, 1.6
 */
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user and include password hash for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check email verification (skipped in local development)
    if (!user.isEmailVerified && process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in',
      });
    }

    // Check organization verification for industry partners (Requirement 1.9)
    if (user.role === UserRole.INDUSTRY && !user.isOrganizationVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your organization is pending verification by an administrator',
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImageUrl: user.profileImageUrl,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal, optional server-side blocklist)
 * Requirements: 1.6
 */
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    // In JWT stateless auth, logout is primarily client-side
    // Optionally implement token blocklist for additional security
    
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during logout',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 * Requirements: 1.5
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User profile retrieved',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImageUrl: user.profileImageUrl,
          organizationId: user.organizationId,
          isEmailVerified: user.isEmailVerified,
          isOrganizationVerified: user.isOrganizationVerified,
          notificationPreferences: user.notificationPreferences,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred retrieving user profile',
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
router.post('/forgot-password', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    const emailSent = await sendPasswordResetEmail(user.email, resetToken);

    if (!emailSent) {
      console.warn(`Failed to send password reset email to ${user.email}`);
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred processing your request',
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpiry: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpiry');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save hook
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred resetting your password',
    });
  }
});

export default router;
