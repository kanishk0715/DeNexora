import mongoose, { Document, Schema } from 'mongoose';

export enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT_SKILL = 'soft_skill',
  APTITUDE = 'aptitude',
  DOMAIN = 'domain',
}

export interface ISkill extends Document {
  name: string;
  aliases: string[];
  category: SkillCategory;
  description?: string;
  industryBenchmark: number; // 0-100
  relatedSkills: mongoose.Types.ObjectId[];
  industryDemandCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    aliases: [{ type: String, trim: true, lowercase: true }],
    category: { type: String, enum: Object.values(SkillCategory), required: true },
    description: { type: String },
    industryBenchmark: { type: Number, default: 70, min: 0, max: 100 },
    relatedSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    industryDemandCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SkillSchema.index({ name: 1 });
SkillSchema.index({ aliases: 1 });
SkillSchema.index({ category: 1 });

const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
export default Skill;
