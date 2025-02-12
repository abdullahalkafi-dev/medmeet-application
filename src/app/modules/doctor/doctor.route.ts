import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorController } from './doctor.controller';
import { DoctorValidation } from './doctor.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(DoctorValidation.createDoctorZodSchema),
  DoctorController.createDoctorToDB
);
router.post(
  '/login',
  validateRequest(DoctorValidation.loginZodSchema),
  DoctorController.loginDoctor
);

router.get(
  '/profile',
  auth(USER_ROLES.DOCTOR),
  DoctorController.getDoctorProfile
);

router.patch(
  '/update-profile',
  auth(USER_ROLES.DOCTOR),
  fileUploadHandler,
  validateRequest(DoctorValidation.updateDoctorZodSchema),
  DoctorController.updateDoctorProfile
);

router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN,USER_ROLES.DOCTOR),
  DoctorController.getAllDoctors
);

router.get(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN,USER_ROLES.DOCTOR),
  DoctorController.getSingleDoctor
);

export const DoctorRoutes = router;
