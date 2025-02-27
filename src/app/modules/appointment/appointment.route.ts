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
  '/prescriptions/:userId',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AppointmentControllers.getAllUserPrescriptions
);

router.get(
  '/doctor/:doctorId',
  
  auth(USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AppointmentControllers.doctorAppointments
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

router.post(
  '/note/:id',
  auth(
    USER_ROLES.USER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DOCTOR
  ),
  validateRequest(AppointmentValidation.addNoteValidation),
  AppointmentControllers.addNoteToAppointment
);

router.post(
  '/note/toggle/:id',
  auth(
    USER_ROLES.USER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DOCTOR
  ),
  AppointmentControllers.toggleIsNoteHidden
);

router.post(
  '/prescription/:id',
  auth(
    USER_ROLES.USER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DOCTOR
  ),
  fileUploadHandler,
  AppointmentControllers.addPrescriptionToAppointment
);
router.post(
  '/status/:id',
  auth(USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN,USER_ROLES.USER),
  validateRequest(AppointmentValidation.appointmentStatusUpdateValidation),
  AppointmentControllers.appointmentStatusUpdate
);
 

export const AppointmentRouter = router;
