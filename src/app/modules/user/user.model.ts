import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';
import { TUser, UserModal } from './user.interface';

const userSchema = new Schema<TUser, UserModal>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
      default: USER_ROLES.USER,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    dob: {
      type: String,
    },
    country: {
      type: String,
      required: true,
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
userSchema.index({ email: 1 });

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

userSchema.statics.isExistUserByPhnNum = async (phoneNumber: string) => {
  const isExist = await User.findOne({ phoneNumber });
  return isExist;
};

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//check if JWT issued before password changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
): boolean => {
  return jwtIssuedTimestamp < passwordChangedTimestamp.getTime();
};

//check user
userSchema.pre('save', async function (next) {
  //password hash
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const User = model<TUser, UserModal>('User', userSchema);
