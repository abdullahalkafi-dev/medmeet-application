import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { MedicineController } from './medicine.controller';
import validateRequest from '../../middlewares/validateRequest';
import { MedicineValidation } from './medicine.validation';
const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(MedicineValidation.createMedicineZodValidation),
  MedicineController.createMedicine
);
router.get(
  '/',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.USER,
    USER_ROLES.DOCTOR
  ),
  MedicineController.getAllMedicines
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MedicineController.deleteMedicine
);
router.post(
  '/update-medicine/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(MedicineValidation.updateMedicineZodValidation),
  MedicineController.updateMedicine
);

export const MedicineRoutes = router;
