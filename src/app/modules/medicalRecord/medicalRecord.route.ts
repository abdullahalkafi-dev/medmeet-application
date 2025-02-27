import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { MedicalRecordController } from './medicalRecord.controller';
import { MedicalRecordValidation } from './medicalRecord.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN,USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler,
  validateRequest(MedicalRecordValidation.createMedicalRecordValidation),
 
  MedicalRecordController.createMedicalRecord
);

router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN,USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.USER),
  MedicalRecordController.getAllMedicalRecords
);

router.get(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN,USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.USER),
  MedicalRecordController.getMedicalRecordById
);

router.post(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN,USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(MedicalRecordValidation.updateMedicalRecordValidation),
  MedicalRecordController.updateMedicalRecord
);

router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN,USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.USER),
  MedicalRecordController.deleteMedicalRecord
);

export const MedicalRecordRoutes = router;
