import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SettingController } from './setting.controller';
import { SettingValidation } from './setting.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), // Assuming only admins can create settings
  validateRequest(SettingValidation.createSettingZodSchema), // Assuming you have a validation schema
  SettingController.createSetting
);

router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), // Assuming only admins can get settings
  SettingController.getSettings
);

router.patch(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), // Assuming only admins can update settings
  validateRequest(SettingValidation.updateSettingZodSchema), // Assuming you have a validation schema
  SettingController.updateSetting
);

export const SettingRoutes = router;
