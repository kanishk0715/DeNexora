import mongoose, { Document, Schema } from 'mongoose';

export enum ApplicationStatus {
  APPLIED = 'applied',
  UNDER_REVIEW = 'under_review',
  SHORTLISTED = 'shortlisted',
  ASSESSMENT = 'assessment',
  INTERVIEW = 'interview',
  SELECTED = 'selected',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

// Valid state machine transitions
export const VALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.APPLIED]: [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.UNDER_REVIEW]: [ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.SHORTLISTED]: [ApplicationStatus.ASSESSMENT, ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.ASSESSMENT]: [ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.INTERVIEW]: [ApplicationStatus.SELECTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.SELECTED]: [ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.REJECTED]: [],
  [ApplicationStatus.WITHDRAWN]: [],
};

export interface IApplication extends Document {
  applicantId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  portfolioSnapshot: Record<string, unknown>;
  matchScore: number;
  status: ApplicationStatus;
  statusHistory: {
    status: ApplicationStatus;
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
    note?: string;
  }[];
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    portfolioSnapshot: { type: Schema.Types.Mixed, default: {} },
    matchScore: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
    },
    statusHistory: [
      {
        status: { type: String, enum: Object.values(ApplicationStatus), required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        note: { type: String },
      },
    ],
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ applicantId: 1, opportunityId: 1 }, { unique: true });
ApplicationSchema.index({ opportunityId: 1, status: 1 });
ApplicationSchema.index({ applicantId: 1, status: 1 });

const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
export default Application;
