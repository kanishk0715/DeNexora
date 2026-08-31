import mongoose, { Document, Schema } from 'mongoose';

export enum OpportunityType {
  INTERNSHIP = 'internship',
  APPRENTICESHIP = 'apprenticeship',
  LIVE_PROJECT = 'live_project',
  ENTRY_LEVEL_JOB = 'entry_level_job',
  RESEARCH_COLLABORATION = 'research_collaboration',
  FDP = 'fdp',
  FACULTY_INTERNSHIP = 'faculty_internship',
  CONSULTANCY = 'consultancy',
}

export enum OpportunityStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  WITHDRAWN = 'withdrawn',
}

export enum WorkMode {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
}

export enum TargetAudience {
  STUDENT = 'student',
  ACADEMICIAN = 'academician',
  BOTH = 'both',
}

export interface IOpportunity extends Document {
  industryId: mongoose.Types.ObjectId;
  title: string;
  type: OpportunityType;
  targetAudience: TargetAudience;
  description: string;
  requiredSkills: {
    skillId: mongoose.Types.ObjectId;
    name: string;
    requiredScore: number;
  }[];
  eligibilityCriteria: {
    minCgpa?: number;
    branches: string[];
    graduationYears: number[];
  };
  duration: string;
  stipend?: string;
  location?: string;
  workMode: WorkMode;
  numberOfPositions: number;
  applicationDeadline: Date;
  status: OpportunityStatus;
  applicantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    industryId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(OpportunityType), required: true },
    targetAudience: { type: String, enum: Object.values(TargetAudience), default: TargetAudience.STUDENT },
    description: { type: String, required: true },
    requiredSkills: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
        name: { type: String, required: true },
        requiredScore: { type: Number, min: 0, max: 100, default: 60 },
      },
    ],
    eligibilityCriteria: {
      minCgpa: { type: Number, min: 0, max: 10 },
      branches: [{ type: String }],
      graduationYears: [{ type: Number }],
    },
    duration: { type: String, required: true },
    stipend: { type: String },
    location: { type: String },
    workMode: { type: String, enum: Object.values(WorkMode), default: WorkMode.ONSITE },
    numberOfPositions: { type: Number, required: true, min: 1 },
    applicationDeadline: { type: Date, required: true },
    status: { type: String, enum: Object.values(OpportunityStatus), default: OpportunityStatus.ACTIVE },
    applicantCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

OpportunitySchema.index({ status: 1, applicationDeadline: 1 });
OpportunitySchema.index({ industryId: 1 });
OpportunitySchema.index({ type: 1 });
OpportunitySchema.index({ targetAudience: 1 });

const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
export default Opportunity;
