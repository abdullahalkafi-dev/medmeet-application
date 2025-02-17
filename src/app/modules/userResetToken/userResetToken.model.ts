import { model, Schema } from 'mongoose';
import { IUserResetToken, UserResetTokenModel } from './userResetToken.interface';

const userResetTokenSchema = new Schema<IUserResetToken, UserResetTokenModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
    
//token check
userResetTokenSchema.statics.isExistToken = async (
  token: string
): Promise<IUserResetToken | null> => {
  return await UserResetToken.findOne({ token });
};
 
//token validity check
userResetTokenSchema.statics.isExpireToken = async (token: string) => {
  const currentDate = new Date();
  const resetToken = await UserResetToken.findOne({
    token,
    expireAt: { $gt: currentDate },
  });
  return !!resetToken;
};
 
export const UserResetToken = model<IUserResetToken, UserResetTokenModel>(
  'UserResetToken',
  userResetTokenSchema
);
