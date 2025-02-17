import { model, Schema } from 'mongoose';
import {
  DoctorResetTokenModel,
  IDoctorResetToken,
} from './doctorResetToken.interface';

const doctorResetTokenSchema = new Schema<
  IDoctorResetToken,
  DoctorResetTokenModel
>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
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
doctorResetTokenSchema.statics.isExistToken = async (
  token: string
): Promise<IDoctorResetToken | null> => {
  return await DoctorResetToken.findOne({ token });
};

//token validity check
doctorResetTokenSchema.statics.isExpireToken = async (token: string) => {
  const currentDate = new Date();
  const resetToken = await DoctorResetToken.findOne({
    token,
    expireAt: { $gt: currentDate },
  });
  return !!resetToken;
};

export const DoctorResetToken = model<IDoctorResetToken, DoctorResetTokenModel>(
  'DoctorResetToken',
  doctorResetTokenSchema
);
