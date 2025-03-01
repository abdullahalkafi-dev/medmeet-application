"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const appointment_validation_1 = require("./appointment.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const appointment_controller_1 = require("./appointment.controller");
const router = (0, express_1.Router)();
router.post('/book', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), fileUploadHandler_1.default, // Middleware for handling file uploads
(0, validateRequest_1.default)(appointment_validation_1.AppointmentValidation.createAppointmentZodSchema), appointment_controller_1.AppointmentControllers.bookAppointment);
router.get('/user/:userId', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), appointment_controller_1.AppointmentControllers.getUserAppointments);
router.get('/prescriptions/:userId', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), appointment_controller_1.AppointmentControllers.getAllUserPrescriptions);
router.get('/doctor/count/:doctorId', (0, auth_1.default)(user_1.USER_ROLES.DOCTOR, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), appointment_controller_1.AppointmentControllers.doctorAppointmentCounts);
router.get('/doctor/:doctorId', (0, auth_1.default)(user_1.USER_ROLES.DOCTOR, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), appointment_controller_1.AppointmentControllers.doctorAppointments);
router.get('/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.DOCTOR), appointment_controller_1.AppointmentControllers.getAppointmentDetails);
router.post('/review/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(appointment_validation_1.AppointmentValidation.reviewValidation), appointment_controller_1.AppointmentControllers.reviewAppointment);
router.post('/note/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.DOCTOR), (0, validateRequest_1.default)(appointment_validation_1.AppointmentValidation.addNoteValidation), appointment_controller_1.AppointmentControllers.addNoteToAppointment);
router.post('/note/toggle/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.DOCTOR), appointment_controller_1.AppointmentControllers.toggleIsNoteHidden);
router.post('/prescription/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.DOCTOR), fileUploadHandler_1.default, appointment_controller_1.AppointmentControllers.addPrescriptionToAppointment);
router.post('/status/:id', (0, auth_1.default)(user_1.USER_ROLES.DOCTOR, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.USER), (0, validateRequest_1.default)(appointment_validation_1.AppointmentValidation.appointmentStatusUpdateValidation), appointment_controller_1.AppointmentControllers.appointmentStatusUpdate);
exports.AppointmentRouter = router;
