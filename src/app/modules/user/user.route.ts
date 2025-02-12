import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';


const router = express.Router();

router.post(
  '/',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUserToDB
);
router.post(
  '/login',
  validateRequest(UserValidation.loginZodSchema),
  UserController.loginUser
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
