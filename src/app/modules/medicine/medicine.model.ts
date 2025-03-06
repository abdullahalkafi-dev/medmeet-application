import { model, Schema } from 'mongoose';
import { TMedicine } from './medicine.interface';

const medicineSchema = new Schema<TMedicine>(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Medicine = model<TMedicine>('Medicine', medicineSchema);
