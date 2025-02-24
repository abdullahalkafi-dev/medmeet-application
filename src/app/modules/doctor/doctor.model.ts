import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';
import { TDoctor, DoctorModal } from './doctor.interface';
const doctorSchema = new Schema<TDoctor, DoctorModal>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
      default: USER_ROLES.DOCTOR,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    dob: {
      type: Date,
    },
    country: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
    },
    specialist: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    experience: {
      type: Number,
    },
    clinic: {
      type: String,
    },
    clinicAddress: {
      type: String,
    },
    consultationFee: {
      type: Number,
    },
    aboutDoctor: {
      type: String,
    },
    professionalIdFront: {
      type: String,
    },
    professionalIdBack: {
      type: String,
    },
    medicalLicense: {
      type: String,
    },
    image: {
      type: String,
    },
    subscription: {
      type: Boolean,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    approvedStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isAllFieldsFilled: {
      type: Boolean,
      default: false,
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
      select: false,
    },
  },
  { timestamps: true }
);
doctorSchema.index({ email: 1 });
doctorSchema.index({ doctorId: 1 });
//exist user check
doctorSchema.statics.isExistDoctorById = async (id: string) => {
  const isExist = await Doctor.findById(id);
  return isExist;
};

doctorSchema.statics.isExistDoctorByEmail = async (email: string) => {
  const isExist = await Doctor.findOne({ email });
  return isExist;
};

doctorSchema.statics.isExistDoctorByPhnNum = async (phoneNumber: string) => {
  const isExist = await Doctor.findOne({ phoneNumber });
  return isExist;
};

//is match password
doctorSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//check if JWT issued before password changed
doctorSchema.statics.isJWTIssuedBeforePasswordChanged = (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
): boolean => {
  return jwtIssuedTimestamp < passwordChangedTimestamp.getTime();
};

//check user
doctorSchema.pre('save', async function (next) {
  //password hash
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const Doctor = model<TDoctor, DoctorModal>('Doctor', doctorSchema);
