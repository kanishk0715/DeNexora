import mongoose, { Document, Schema } from 'mongoose';

export interface IAcademicianProfile extends Document {
  userId: mongoose.Types.ObjectId;
  institution: string;
  department: string;
  expertiseAreas: string[];
  publications: string[];
  researchInterests: string[];
  institutionalAffiliation: string;
  previousIndustryEngagements: string[];
  cvUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicianProfileSchema = new Schema<IAcademicianProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    institution: { type: String, required: true },
    department: { type: String, required: true },
    expertiseAreas: [{ type: String }],
    publications: [{ type: String }],
    researchInterests: [{ type: String }],
    institutionalAffiliation: { type: String, required: true },
    previousIndustryEngagements: [{ type: String }],
    cvUrl: { type: String },
  },
  { timestamps: true }
);

AcademicianProfileSchema.index({ userId: 1 });

const AcademicianProfile = mongoose.model<IAcademicianProfile>('AcademicianProfile', AcademicianProfileSchema);
export default AcademicianProfile;
