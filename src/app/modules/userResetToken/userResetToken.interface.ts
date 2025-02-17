import { Model, Types } from 'mongoose';

export type IUserResetToken = {
  user: Types.ObjectId;
  token: string;
  expireAt: Date;
};

export type UserResetTokenModel = {
  isExistToken(token: string): any;
  isExpireToken(token: string): boolean;
} & Model<IUserResetToken>;
