"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const doctor_controller_1 = require("./doctor.controller");
const doctor_validation_1 = require("./doctor.validation");
const auth_validation_1 = require("../auth/auth.validation");
const auth_controller_1 = require("../auth/auth.controller");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(doctor_validation_1.DoctorValidation.createDoctorZodSchema), doctor_controller_1.DoctorController.createDoctorToDB);
//auth for doctor
router.post('/login', (0, validateRequest_1.default)(doctor_validation_1.DoctorValidation.loginZodSchema), doctor_controller_1.DoctorController.loginDoctor);
router.post('/forgot-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.createForgetPasswordZodSchema), auth_controller_1.AuthController.doctorForgetPasswordToDB);
router.post('/verify-email', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.createVerifyEmailZodSchema), auth_controller_1.AuthController.doctorVerifyEmail);
router.post('/doctor-resend-otp', auth_controller_1.AuthController.doctorResendOtp);
router.post('/reset-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.createResetPasswordZodSchema), auth_controller_1.AuthController.doctorResetPasswordToDB);
router.post('/change-password', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.DOCTOR), (0, validateRequest_1.default)(auth_validation_1.AuthValidation.createChangePasswordZodSchema), auth_controller_1.AuthController.doctorChangePasswordToDB);
router.get('/profile', (0, auth_1.default)(user_1.USER_ROLES.DOCTOR), doctor_controller_1.DoctorController.getDoctorProfile);
router.post('/update-profile', (0, auth_1.default)(user_1.USER_ROLES.DOCTOR), fileUploadHandler_1.default, (0, validateRequest_1.default)(doctor_validation_1.DoctorValidation.updateDoctorZodSchema), doctor_controller_1.DoctorController.updateDoctorProfile);
router.post('/approve-doctor/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), doctor_controller_1.DoctorController.updateDoctorApprovedStatus);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.DOCTOR, user_1.USER_ROLES.USER), doctor_controller_1.DoctorController.getAllDoctors);
router.get('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.DOCTOR, user_1.USER_ROLES.USER), doctor_controller_1.DoctorController.getSingleDoctor);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.DOCTOR, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), doctor_controller_1.DoctorController.deleteDoctor);
exports.DoctorRoutes = router;
