"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const setting_controller_1 = require("./setting.controller");
const setting_validation_1 = require("./setting.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), // Assuming only admins can create settings
(0, validateRequest_1.default)(setting_validation_1.SettingValidation.createSettingZodSchema), // Assuming you have a validation schema
setting_controller_1.SettingController.createSetting);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), // Assuming only admins can get settings
setting_controller_1.SettingController.getSettings);
router.post('/update-setting', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), // Assuming only admins can update settings
(0, validateRequest_1.default)(setting_validation_1.SettingValidation.updateSettingZodSchema), // Assuming you have a validation schema
setting_controller_1.SettingController.updateSetting);
exports.SettingRoutes = router;
