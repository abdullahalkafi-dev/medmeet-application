import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type TDoctor = {
  name: string;
  role: USER_ROLES;
  email: string; // unique
  phoneNumber: string; // unique

  gender: 'Male' | 'Female';
  dob?: Date; //dd/mm/yyyy
  country: string;
  doctorId: string;
  specialist: Types.ObjectId;
  experience: number; // years
  clinic: string;
  clinicAddress: string;
  consultationFee: number;
  aboutDoctor: string;
  professionalIdFront: string;
  professionalIdBack: string;
  medicalLicense: string;
  image?: string;
  subscription: boolean;
  password: string;
  fcmToken?: string;
  status: 'active' | 'delete';
  verified?: boolean;
  approvedStatus?: 'pending' | 'approved' | 'rejected';
  avgRating: number;
  isAllFieldsFilled?: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type DoctorModal = {
  isExistDoctorById(id: string): any;
  isExistDoctorByEmail(email: string): any;
  isExistDoctorByPhnNum(phnNum: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
} & Model<TDoctor>;
