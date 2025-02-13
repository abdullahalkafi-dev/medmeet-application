import { model, Schema } from 'mongoose';
import { TMedicine } from './medicine.interface';

const medicineSchema = new Schema<TMedicine>({
  name: {
    type: String,
    required: true,
  },
});
export const Medicine = model<TMedicine>('Medicine', medicineSchema);
