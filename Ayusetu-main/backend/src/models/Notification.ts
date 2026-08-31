import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
  APPLICATION_UPDATE = 'application_update',
  RECOMMENDATION = 'recommendation',
  DEADLINE_ALERT = 'deadline_alert',
  MENTOR_FEEDBACK = 'mentor_feedback',
  VERIFICATION = 'verification',
  SYSTEM = 'system',
}

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: mongoose.Types.ObjectId;
  relatedEntityType?: string;
  isRead: boolean;
  emailSent: boolean;
  emailAttempts: number;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedEntityId: { type: Schema.Types.ObjectId },
    relatedEntityType: { type: String },
    isRead: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    emailAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ recipientId: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
