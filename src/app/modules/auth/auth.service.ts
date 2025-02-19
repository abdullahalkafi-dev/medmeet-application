import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';

import { emailHelper } from '../../../helpers/emailHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import {
  IAuthResetPassword,
  IChangePassword,
  IVerifyEmail,
} from '../../../types/auth';
import cryptoToken from '../../../util/cryptoToken';
import generateOTP from '../../../util/generateOTP';
import { User } from '../user/user.model';

import AppError from '../../errors/AppError';
import { Doctor } from '../doctor/doctor.model';
import { UserResetToken } from '../userResetToken/userResetToken.model';
import { DoctorResetToken } from '../doctorResetToken/doctorResetToken.model';
const userForgetPasswordToDB = async (uniqueId: string) => {
  console.log(uniqueId);
  const isExistUser = await User.findOne({ email: uniqueId });
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const forgetPassword = emailTemplate.resetPassword(value);

  emailHelper.sendEmail(forgetPassword);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 600000),
  };
  console.log(authentication);
  console.log(value);
  await User.findOneAndUpdate(
    { email: uniqueId },
    { $set: { authentication } }
  );
};
//doctor forget password
const doctorForgetPasswordToDB = async (uniqueId: string) => {
  const isExistUser = await Doctor.findOne({
    $or: [{ email: uniqueId }, { doctorId: uniqueId }],
  });
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const forgetPassword = emailTemplate.resetPassword(value);

  emailHelper.sendEmail(forgetPassword);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 6000000),
  };
  console.log(authentication);
  console.log(value);
  await Doctor.findOneAndUpdate(
    { $or: [{ email: uniqueId }, { doctorId: uniqueId }] },
    { $set: { authentication } }
  );
};

//verify user email
const userVerifyEmailToDB = async (payload: IVerifyEmail) => {
  console.log(payload);
  const { uniqueId, oneTimeCode } = payload;
  if (!uniqueId || !oneTimeCode) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Please provide email and otp');
  }
  const isExistUser = await User.findOne({ email: uniqueId }).select(
    '+authentication'
  );
  console.log(isExistUser);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your email we send a code'
    );
  }

  console.log(oneTimeCode);
  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }

  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }

  let message;
  let data;

  await User.findOneAndUpdate(
    { _id: isExistUser._id },
    {
      authentication: {
        isResetPassword: true,
        oneTimeCode: null,
        expireAt: null,
      },
      verified: true,
    }
  );

  //create token ;
  const createToken = cryptoToken();
  await UserResetToken.create({
    user: isExistUser._id,
    token: createToken,
    expireAt: new Date(Date.now() + 5 * 600000),
  });
  message =
    'Verification Successful: Please securely store and utilize this code for reset password';
  data = createToken;

  return { data, message };
};

//resent otp
const userResendOtp = async (uniqueId: string) => {
  const isExistUser = await User.findOne({ email: uniqueId });
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const verifyUserMail = emailTemplate.createAccount({
    ...value,
    name: isExistUser.name,
  });

  emailHelper.sendEmail(verifyUserMail);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 6000000),
  };
  console.log;
  await User.findOneAndUpdate(
    { email: uniqueId },
    { $set: { authentication } }
  );
};
const doctorResendOtp = async (uniqueId: string) => {
  const isExistUser = await Doctor.findOne({
    $or: [{ email: uniqueId }, { doctorId: uniqueId }],
  });
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const verifyDoctorMail = emailTemplate.createAccount({
    ...value,
    name: isExistUser.name,
  });

  emailHelper.sendEmail(verifyDoctorMail);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 6000000),
  };
  console.log;
  await Doctor.findOneAndUpdate(
    { email: uniqueId },
    { $set: { authentication } }
  );
};

//verify doctor email
const doctorVerifyEmailToDB = async (payload: IVerifyEmail) => {
  console.log(payload);
  const { uniqueId, oneTimeCode } = payload;
  const isExistUser = await Doctor.findOne({
    $or: [{ email: uniqueId }, { doctorId: uniqueId }],
  }).select('+authentication');
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your email we send a code'
    );
  }

  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }

  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }

  let message;
  let data;

  await Doctor.findOneAndUpdate(
    { _id: isExistUser._id },
    {
      authentication: {
        isResetPassword: true,
        oneTimeCode: null,
        expireAt: null,
      },
      verified: true,
    }
  );

  //create token ;
  const createToken = cryptoToken();
  await DoctorResetToken.create({
    user: isExistUser._id,
    token: createToken,
    expireAt: new Date(Date.now() + 5 * 60000),
  });
  message =
    'Verification Successful: Please securely store and utilize this code for reset password';
  data = createToken;

  return { data, message };
};

//forget password
const userResetPasswordToDB = async (
  token: string,
  payload: IAuthResetPassword
) => {
  const { newPassword, confirmPassword } = payload;
  //isExist token
  const isExistToken = await UserResetToken.isExistToken(token);
  if (!isExistToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
  }

  //user permission check
  const isExistUser = await User.findById(isExistToken.user).select(
    '+authentication'
  );
  if (!isExistUser?.authentication?.isResetPassword) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  //validity check
  const isValid = await UserResetToken.isExpireToken(token);
  if (!isValid) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Token expired, Please click again to the forget password'
    );
  }

  //check password
  if (newPassword !== confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "New password and Confirm password doesn't match!"
    );
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
    new: true,
  });
};

//forget password
const doctorResetPasswordToDB = async (
  token: string,
  payload: IAuthResetPassword
) => {
  const { newPassword, confirmPassword } = payload;
  //isExist token
  const isExistToken = await DoctorResetToken.isExistToken(token);
  if (!isExistToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
  }

  //user permission check
  const isExistUser = await Doctor.findById(isExistToken.user).select(
    '+authentication'
  );
  if (!isExistUser?.authentication?.isResetPassword) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  //validity check
  const isValid = await DoctorResetToken.isExpireToken(token);
  if (!isValid) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Token expired, Please click again to the forget password'
    );
  }

  //check password
  if (newPassword !== confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "New password and Confirm password doesn't match!"
    );
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await Doctor.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
    new: true,
  });
};

const userChangePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword
) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await User.findById(user.id).select('+password');
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //current password match
  if (
    currentPassword &&
    !(await User.isMatchPassword(currentPassword, isExistUser.password))
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Please give different password from current password'
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Password and Confirm password doesn't matched"
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });

  const value = {
    receiver: isExistUser._id,
    text: 'Your password changed successfully',
  };
};
const doctorChangePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword
) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await Doctor.findById(user.id).select('+password');
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //current password match
  if (
    currentPassword &&
    !(await Doctor.isMatchPassword(currentPassword, isExistUser.password))
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Please give different password from current password'
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Password and Confirm password doesn't matched"
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
  };
  await Doctor.findOneAndUpdate({ _id: user.id }, updateData, { new: true });

  const value = {
    receiver: isExistUser._id,
    text: 'Your password changed successfully',
  };
};

const deleteAccountToDB = async (user: JwtPayload) => {
  const result = await User.findByIdAndUpdate(
    user.id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No User found');
  }
  return result;
};

const userNewAccessTokenToUser = async (token: string) => {
  // Check if the token is provided
  if (!token) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Token is required!');
  }

  const verifyUser = jwtHelper.verifyToken(
    token,
    config.jwt.jwt_refresh_secret as Secret
  );

  const isExistUser = await User.findById(verifyUser?.id);
  if (!isExistUser) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access');
  }

  //create token
  const accessToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  return { accessToken };
};

const newAccessTokenToUser = async (token: string) => {
  // Check if the token is provided
  if (!token) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Token is required!');
  }

  const verifyUser = jwtHelper.verifyToken(
    token,
    config.jwt.jwt_refresh_secret as Secret
  );

  const isExistUser = await Doctor.findById(verifyUser?.id);
  if (!isExistUser) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access');
  }

  //create token
  const accessToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  return { accessToken };
};

export const AuthService = {
  userVerifyEmailToDB,
  doctorVerifyEmailToDB,
  doctorForgetPasswordToDB,
  userForgetPasswordToDB,
  deleteAccountToDB,
  newAccessTokenToUser,
  userNewAccessTokenToUser,
  userChangePasswordToDB,
  doctorChangePasswordToDB,
  userResetPasswordToDB,
  doctorResetPasswordToDB,
  userResendOtp,
  doctorResendOtp,
};
