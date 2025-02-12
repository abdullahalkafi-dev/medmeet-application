import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type TDoctor = {
  name: string;
  role: USER_ROLES;
  email: string; // unique
  phoneNumber: string; // unique

  gender: 'male' | 'female';
  dob?: string; //dd/mm/yyyy
  country: string;
  doctorId: string;
  specialist: string;
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
  status: 'active' | 'delete';
  verified?: boolean; 
  isApproved?: boolean;
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
