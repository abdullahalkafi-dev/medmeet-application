"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleRouter = void 0;
const express_1 = require("express");
const doctorSchedule_controller_1 = require("./doctorSchedule.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const doctorSchedule_validation_1 = require("./doctorSchedule.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = (0, express_1.Router)();
router.post('/create', (0, auth_1.default)(user_1.USER_ROLES.DOCTOR, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(doctorSchedule_validation_1.DoctorScheduleValidation.createDoctorScheduleZodSchema), doctorSchedule_controller_1.DoctorScheduleController.createDoctorSchedule);
router.get('/doctor/:doctorId', doctorSchedule_controller_1.DoctorScheduleController.getDoctorSchedules);
router.get('/available-slots', doctorSchedule_controller_1.DoctorScheduleController.getAvailableSlots);
exports.DoctorScheduleRouter = router;
