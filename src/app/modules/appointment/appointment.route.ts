import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { AppointmentValidation } from './appointment.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { AppointmentControllers } from './appointment.controller';

const router = Router();

router.post(
  '/book',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler, // Middleware for handling file uploads
  validateRequest(AppointmentValidation.createAppointmentZodSchema),
  AppointmentControllers.bookAppointment
);

router.get(
  '/user/:userId',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AppointmentControllers.getUserAppointments
);
router.get(
  '/:id',
  auth(
    USER_ROLES.USER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DOCTOR
  ),
  AppointmentControllers.getAppointmentDetails
);
router.post(
  '/review/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(AppointmentValidation.reviewValidation),
  AppointmentControllers.reviewAppointment
);

export const AppointmentRouter = router;
