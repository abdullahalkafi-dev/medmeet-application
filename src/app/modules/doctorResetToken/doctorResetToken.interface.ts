import { Model, Types } from 'mongoose';

export type IDoctorResetToken = {
  user: Types.ObjectId;
  token: string;
  expireAt: Date;
};

export type DoctorResetTokenModel = {
  isExistToken(token: string): any;
  isExpireToken(token: string): boolean;
} & Model<IDoctorResetToken>;
