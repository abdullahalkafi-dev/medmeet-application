import { Types } from 'mongoose';

export type TNotification = {
  body: string;
  user: Types.ObjectId;
};
