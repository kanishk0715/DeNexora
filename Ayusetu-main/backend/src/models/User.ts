import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * User roles in the system
 */
export enum UserRole {
  STUDENT = 'student',
  ACADEMICIAN = 'academician',
  INDUSTRY = 'industry',
  INSTITUTION = 'institution',
  ADMIN = 'admin',
}

/**
 * Notification preferences interface
 */
export interface NotificationPreferences {
  applicationUpdates: boolean;
  recommendations: boolean;
  deadlineAlerts: boolean;
  mentorFeedback: boolean;
}

/**
 * User document interface
 */
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  profileImageUrl?: string;
  organizationId?: mongoose.Types.ObjectId;
  isEmailVerified: boolean;
  isOrganizationVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  notificationPreferences: NotificationPreferences;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User schema definition
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never return password hash in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, 'User role is required'],
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImageUrl: {
      type: String,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      refPath: 'role', // Dynamic reference based on role
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isOrganizationVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      select: false,
    },
    notificationPreferences: {
      applicationUpdates: {
        type: Boolean,
        default: true,
      },
      recommendations: {
        type: Boolean,
        default: true,
      },
      deadlineAlerts: {
        type: Boolean,
        default: true,
      },
      mentorFeedback: {
        type: Boolean,
        default: true,
      },
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

// Indexes
UserSchema.index({ email: 1 }); // Unique index already handled by unique: true
UserSchema.index({ role: 1 });
UserSchema.index({ organizationId: 1 });

/**
 * Pre-save hook: Hash password before saving if modified
 * Requirements: 1.1, 17.2 (bcrypt password hashing)
 */
UserSchema.pre('save', async function (next) {
  // Only hash password if it's new or modified
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    // Generate salt with 12 rounds (secure but not too slow)
    const salt = await bcrypt.genSalt(12);
    // Hash the password
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Instance method: Compare provided password with stored hash
 * @param candidatePassword - Plain text password to compare
 * @returns Promise<boolean> - True if passwords match
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    return false;
  }
};

/**
 * Ensure password hash is never returned in JSON responses
 */
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpiry;
  return obj;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
