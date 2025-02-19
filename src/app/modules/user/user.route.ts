import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { AuthValidation } from '../auth/auth.validation';
import { AuthController } from '../auth/auth.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUserToDB
);
//login for user
router.post(
  '/login',
  validateRequest(UserValidation.loginZodSchema),
  UserController.loginUser
);

router.post(
  '/forgot-password',
  validateRequest(AuthValidation.createForgetPasswordZodSchema),
  AuthController.userForgetPasswordToDB
);

router.post(
  '/verify-email',
  validateRequest(AuthValidation.createVerifyEmailZodSchema),
  AuthController.userVerifyEmailToDB
);
router.post(
  '/user-resend-otp',
  AuthController.userResendOtp
);
router.post(
  '/reset-password',
  validateRequest(AuthValidation.createResetPasswordZodSchema),
  AuthController.userResetPasswordToDB
);

router.post(
  '/change-password',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  validateRequest(AuthValidation.createChangePasswordZodSchema),
  AuthController.userChangePasswordToDB
);

router.get(
  '/profile',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  UserController.getUserProfile
);

router.patch(
  '/update-profile',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler,
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUserProfile
);

router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  UserController.getAllUsers
);

router.get(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getSingleUser
);

export const UserRoutes = router;
