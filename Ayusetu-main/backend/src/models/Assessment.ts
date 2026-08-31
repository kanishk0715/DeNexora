import mongoose, { Document, Schema } from 'mongoose';

export enum AssessmentCategory {
  TECHNICAL = 'technical',
  SOFT_SKILL = 'soft_skill',
  APTITUDE = 'aptitude',
  COMBINED = 'combined',
}

export enum GapPriority {
  READY = 'ready',           // 0-10
  MODERATE = 'moderate',     // 11-25
  SIGNIFICANT = 'significant', // 26-40
  MAJOR = 'major',           // 41+
}

export interface IAssessment extends Document {
  title: string;
  category: AssessmentCategory;
  questions: {
    questionId: mongoose.Types.ObjectId;
    text: string;
    options: string[];
    correctAnswer: number;
    skillId: mongoose.Types.ObjectId;
    difficulty: 'easy' | 'medium' | 'hard';
    isAdaptive: boolean;
  }[];
  durationMinutes: number;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IAssessmentResult extends Document {
  studentId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  totalScore: number;
  skillScores: {
    skillId: mongoose.Types.ObjectId;
    skillName: string;
    score: number; // 0-100
    gap: number;   // Required - Student score
    gapPriority: GapPriority;
  }[];
  isActive: boolean; // most recent = true
  completedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true },
    category: { type: String, enum: Object.values(AssessmentCategory), required: true },
    questions: [
      {
        questionId: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        text: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
        isAdaptive: { type: Boolean, default: false },
      },
    ],
    durationMinutes: { type: Number, required: true, default: 60 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const AssessmentResultSchema = new Schema<IAssessmentResult>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    totalScore: { type: Number, required: true, min: 0, max: 100 },
    skillScores: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
        skillName: { type: String, required: true },
        score: { type: Number, required: true, min: 0, max: 100 },
        gap: { type: Number, required: true },
        gapPriority: { type: String, enum: Object.values(GapPriority), required: true },
      },
    ],
    isActive: { type: Boolean, default: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AssessmentResultSchema.index({ studentId: 1, isActive: 1 });
AssessmentResultSchema.index({ studentId: 1, assessmentId: 1 });

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
export const AssessmentResult = mongoose.model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);
