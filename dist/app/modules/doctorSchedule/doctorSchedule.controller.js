"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const doctorSchedule_service_1 = require("./doctorSchedule.service");
const createDoctorSchedule = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = yield doctorSchedule_service_1.DoctorScheduleService.createDoctorSchedule(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Doctor schedule created successfully',
        data: schedule,
    });
}));
const getDoctorSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.params;
    const schedules = yield doctorSchedule_service_1.DoctorScheduleService.getDoctorSchedules(doctorId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Doctor schedules retrieved successfully',
        data: schedules,
    });
}));
const getAvailableSlots = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
        throw new Error('Doctor ID and date are required');
    }
    const slots = yield doctorSchedule_service_1.DoctorScheduleService.getAvailableSlots(doctorId, date);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Available slots retrieved successfully',
        data: slots,
    });
}));
exports.DoctorScheduleController = {
    createDoctorSchedule,
    getDoctorSchedules,
    getAvailableSlots,
};
