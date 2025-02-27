import { Types } from 'mongoose';

export type TMedicalRecord = {
  _id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  medicalHistory: string;
  prescription: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
