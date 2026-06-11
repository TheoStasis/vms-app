import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisit extends Document {
  visitorName: string;
  contact: string;
  photoUrl?: string;
  purpose: string;
  hostId: string; // <-- 1. Changed from mongoose.Types.ObjectId to string
  status: 'Pending' | 'Approved' | 'Checked-In' | 'Completed';
  entryTime?: Date;
  exitTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VisitSchema: Schema<IVisit> = new Schema(
  {
    visitorName: { type: String, required: true },
    contact: { type: String, required: true },
    photoUrl: { type: String, required: false }, 
    purpose: { type: String, required: true },
    hostId: { type: String, required: true }, // <-- 2. Changed to String, removed ref
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Checked-In', 'Completed'],
      default: 'Pending',
    },
    entryTime: { type: Date },
    exitTime: { type: Date },
  },
  { timestamps: true }
);

const Visit: Model<IVisit> = mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema);
export default Visit;