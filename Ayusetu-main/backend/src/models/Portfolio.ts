import mongoose, { Document, Schema } from 'mongoose';
import { VerificationLevel } from './StudentProfile';

export interface IPortfolio extends Document {
  studentId: mongoose.Types.ObjectId;
  publicSlug: string;
  isPublic: boolean;
  showSelfDeclaredItems: boolean;
  certifications: {
    title: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialUrl?: string;
    verificationLevel: VerificationLevel;
    documentUrl?: string;
  }[];
  internshipRecords: {
    opportunityId: mongoose.Types.ObjectId;
    companyName: string;
    role: string;
    startDate: Date;
    endDate?: Date;
    mentorFeedback?: string;
    completionCertificateUrl?: string;
    isVerified: boolean;
  }[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
    url?: string;
    verificationLevel: VerificationLevel;
  }[];
  achievements: string[];
  placementReadinessScore: number;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    publicSlug: { type: String, required: true, unique: true },
    isPublic: { type: Boolean, default: true },
    showSelfDeclaredItems: { type: Boolean, default: false },
    certifications: [
      {
        title: { type: String, required: true },
        issuer: { type: String, required: true },
        issueDate: { type: Date, required: true },
        expiryDate: { type: Date },
        credentialUrl: { type: String },
        verificationLevel: {
          type: String,
          enum: Object.values(VerificationLevel),
          default: VerificationLevel.SELF_DECLARED,
        },
        documentUrl: { type: String },
      },
    ],
    internshipRecords: [
      {
        opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity' },
        companyName: { type: String, required: true },
        role: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        mentorFeedback: { type: String },
        completionCertificateUrl: { type: String },
        isVerified: { type: Boolean, default: false },
      },
    ],
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
    placementReadinessScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

PortfolioSchema.index({ publicSlug: 1 });
PortfolioSchema.index({ studentId: 1 });

const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
export default Portfolio;
