import { Schema, model } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>(
  {
    _id: { type: String, required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  },
  { strict: false }
); // strict: false allows for additional dynamic fields

export const OrderModel = model<TOrder >('Order', orderSchema);
