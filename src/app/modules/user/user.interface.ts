import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type TUser = {
  name: string;
  role: USER_ROLES;
  email: string; // unique
  phoneNumber: string; // unique
  gender: 'Male' | 'Female';
  dob?: Date; //dd/mm/yyyy
  country: string;
  image?: string;
  subscription: boolean;
  password: string;
  address: string;
  status: 'active' | 'delete';
  verified?: boolean;
  isAllFieldsFilled?: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isExistUserByPhnNum(phnNum: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
} & Model<TUser>;
