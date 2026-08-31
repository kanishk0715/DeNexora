import mongoose, { Document, Schema } from 'mongoose';

export enum VerificationLevel {
  SELF_DECLARED = 'self_declared',
  ASSESSMENT_VERIFIED = 'assessment_verified',
  COURSE_VERIFIED = 'course_verified',
  INDUSTRY_VERIFIED = 'industry_verified',
}

export interface IStudentSkill {
  skillId: mongoose.Types.ObjectId;
  name: string;
  score: number; // 0-100
  verificationLevel: VerificationLevel;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
}

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  institution: string;
  department: string;
  branch: string;
  graduationYear: number;
  cgpa?: number;
  careerInterests: string[];
  targetIndustries: string[];
  locationPreference?: string;
  resumeUrl?: string;
  skills: IStudentSkill[];
  aptitudeScore: {
    logicalReasoning: number;
    quantitative: number;
    verbal: number;
  };
  placementReadinessScore: number;
  isPlaced: boolean;
  placedAt?: Date;
  projects: {
    title: string;
    description: string;
    techStack: string[];
    url?: string;
    verificationLevel: VerificationLevel;
  }[];
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentSkillSchema = new Schema(
  {
    skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    name: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    verificationLevel: {
      type: String,
      enum: Object.values(VerificationLevel),
      default: VerificationLevel.SELF_DECLARED,
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
  },
  { _id: false }
);

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    institution: { type: String, required: true },
    department: { type: String, required: true },
    branch: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number, min: 0, max: 10 },
    careerInterests: [{ type: String }],
    targetIndustries: [{ type: String }],
    locationPreference: { type: String },
    resumeUrl: { type: String },
    skills: [StudentSkillSchema],
    aptitudeScore: {
      logicalReasoning: { type: Number, default: 0, min: 0, max: 100 },
      quantitative: { type: Number, default: 0, min: 0, max: 100 },
      verbal: { type: Number, default: 0, min: 0, max: 100 },
    },
    placementReadinessScore: { type: Number, default: 0, min: 0, max: 100 },
    isPlaced: { type: Boolean, default: false },
    placedAt: { type: Date },
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        techStack: [{ type: String }],
        url: { type: String },
        verificationLevel: {
          type: String,
          enum: Object.values(VerificationLevel),
          default: VerificationLevel.SELF_DECLARED,
        },
      },
    ],
    achievements: [{ type: String }],
  },
  { timestamps: true }
);

StudentProfileSchema.index({ userId: 1 });
StudentProfileSchema.index({ graduationYear: 1 });
StudentProfileSchema.index({ department: 1 });

const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
export default StudentProfile;
