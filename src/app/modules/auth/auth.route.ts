// import express from 'express';
// import { USER_ROLES } from '../../../enums/user';
// import auth from '../../middlewares/auth';
// import validateRequest from '../../middlewares/validateRequest';
// import { AuthController } from './auth.controller';
// import { AuthValidation } from './auth.validation';
// const router = express.Router();

// router.post('/refresh-token', AuthController.newAccessTokenToUser);

// router.post(
//   '/forgot-password',
//   validateRequest(AuthValidation.createForgetPasswordZodSchema),
//   AuthController.userForgetPasswordToDB
// );
// router.post(
//   '/doctor/forgot-password',
//   validateRequest(AuthValidation.createForgetPasswordZodSchema),
//   AuthController.doctorForgetPasswordToDB
// );
// router.post(
//   '/verify-email',
//   validateRequest(AuthValidation.createVerifyEmailZodSchema),
//   AuthController.userVerifyEmailToDB
// );
// router.post(
//   '/doctor/verify-email',
//   validateRequest(AuthValidation.createVerifyEmailZodSchema),
//   AuthController.doctorVerifyEmail
// );
// router.post(
//   '/reset-password',
//   validateRequest(AuthValidation.createResetPasswordZodSchema),
//   AuthController.userResetPasswordToDB
// );
// router.post(
//   '/doctor/reset-password',
//   validateRequest(AuthValidation.createResetPasswordZodSchema),
//   AuthController.doctorResetPasswordToDB
// );

// router.post(
//   '/change-password',
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER),
//   validateRequest(AuthValidation.createChangePasswordZodSchema),
//   AuthController.userChangePasswordToDB
// );
// router.post(
//   '/doctor/change-password',
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER),
//   validateRequest(AuthValidation.createChangePasswordZodSchema),
//   AuthController.doctorChangePasswordToDB
// );

// export const AuthRoutes = router;
