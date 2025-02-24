import { Router } from 'express';
import { DoctorScheduleController } from './doctorSchedule.controller';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorScheduleValidation } from './doctorSchedule.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router.post(
  '/create',
  auth(USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(DoctorScheduleValidation.createDoctorScheduleZodSchema),
  DoctorScheduleController.createDoctorSchedule
);
router.get('/doctor/:doctorId', DoctorScheduleController.getDoctorSchedules);
router.get('/available-slots', DoctorScheduleController.getAvailableSlots);

export const DoctorScheduleRouter = router;
