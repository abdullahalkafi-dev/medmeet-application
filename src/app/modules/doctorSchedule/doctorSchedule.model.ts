import { model, Schema } from 'mongoose';
import { TDoctorSchedule, TSlot } from './doctorSchedule.interface';

const SlotSchema = new Schema<TSlot>({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
});

const DoctorScheduleSchema = new Schema<TDoctorSchedule>({
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  slots: [SlotSchema],
});

export const DoctorSchedule = model<TDoctorSchedule>(
  'DoctorSchedule',
  DoctorScheduleSchema
);
