import { Types } from 'mongoose';

export interface IChat {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  senderModel: 'User' | 'Doctor';
  receiverModel: 'User' | 'Doctor';
  message?: string;
  seenBy: string[];
  file?: string;
}
