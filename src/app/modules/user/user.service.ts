import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';

import unlinkFile from '../../../shared/unlinkFile';
import AppError from '../../errors/AppError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { TUser } from './user.interface';
import { User } from './user.model';
import { USER_ROLES } from '../../../enums/user';

const createUserToDB = async (payload: Partial<TUser>) => {
  if (!payload.fcmToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Please provide fcm token');
  }

  // Validate required fields
  const isExist = await User.findOne({
    email: payload.email,
  });
  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User already exist');
  }
  // Create user first
  const user = await User.create(payload);
  if (payload.fcmToken) {
    await User.findByIdAndUpdate(user._id, { fcmToken: payload.fcmToken });
  }
  return user;
};

const loginUser = async (payload: Partial<TUser> & { uniqueId: string }) => {
  const { uniqueId, password, fcmToken } = payload;
  console.log(payload);
  if (!uniqueId || !password) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Please provide email and password'
    );
  }
  let user = await User.findOne({
    email: uniqueId,
  }).select('+password');
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  const isMatch = await User.isMatchPassword(password!, user.password);
  if (!isMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid credentials');
  }
  const accessToken = jwtHelper.createToken(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    config.jwt.jwt_secret as Secret,
    '10000d'
  );
  //create token
  const refreshToken = jwtHelper.createToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt.jwt_refresh_secret as Secret,
    '15000d'
  );

  if (fcmToken) {
    user = await User.findByIdAndUpdate(user._id, { fcmToken });
  }

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  const { password: _, ...userWithoutPassword } = user.toObject();
  return { accessToken, refreshToken, user: userWithoutPassword };
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<TUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return isExistUser;
};

const updateUserProfileToDB = async (
  userId: JwtPayload,
  payload: Partial<TUser>
) => {
  const { id } = userId;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  if (
    payload.image &&
    isExistUser.image &&
    !isExistUser.image.includes('default_profile.jpg') &&
    !payload.image.includes(isExistUser.image)
  ) {
    unlinkFile(isExistUser.image);
  }
  if (payload.dob) {
    const [day, month, year] = (payload.dob as any).split('-');
    payload.dob = new Date(`${year}-${month}-${day}`);
    console.log(payload.dob);
  }
  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    upsert: true,
  });
  let finalUserDocument;
  if (
    !updateDoc.isAllFieldsFilled &&
    updateDoc &&
    !!(
      updateDoc.image &&
      updateDoc.phoneNumber &&
      updateDoc.gender &&
      updateDoc.dob &&
      updateDoc.country
    )
  ) {
    finalUserDocument = await User.findOneAndUpdate(
      { _id: id },
      { isAllFieldsFilled: true },
      { new: true }
    );
  }
  return finalUserDocument ? finalUserDocument : updateDoc;
};

const getSingleUser = async (id: string): Promise<TUser | null> => {
  const result = await User.findById(id);
  return result;
};

//get all users
const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return { result, meta };
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { status: 'delete' },
    { new: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  if (result.role === USER_ROLES.SUPER_ADMIN) {
    await User.findByIdAndUpdate(id, { status: 'active' }, { new: true });
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You can't delete super admin!"
    );
  }
  return result;
};

export const UserService = {
  getUserProfileFromDB,
  updateUserProfileToDB,
  getSingleUser,
  createUserToDB,
  getAllUsers,
  loginUser,
  deleteUser,
};
