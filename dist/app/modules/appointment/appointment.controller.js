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
exports.AppointmentControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const appointment_service_1 = require("./appointment.service");
const bookAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_service_1.AppointmentServices.bookAppointment(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Appointment booked successfully',
        data: result,
    });
}));
const getUserAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const result = yield appointment_service_1.AppointmentServices.getUserAppointments(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User appointments fetched successfully',
        data: result,
    });
}));
const getAppointmentDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentId = req.params.id;
    const result = yield appointment_service_1.AppointmentServices.getAppointmentDetails(appointmentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Appointment fetched successfully',
        data: result,
    });
}));
const reviewAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const appointmentId = req.params.id;
    const payload = req.body;
    console.log(req.user.id, req.body);
    const result = yield appointment_service_1.AppointmentServices.reviewAppointment(appointmentId, req.user.id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Appointment reviewed successfully',
        data: result,
    });
}));
const getAllUserPrescriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const result = yield appointment_service_1.AppointmentServices.getAllUserPrescriptions(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User prescriptions fetched successfully',
        data: result,
    });
}));
const addNoteToAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentId = req.params.id;
    const payload = req.body;
    const result = yield appointment_service_1.AppointmentServices.addNoteToAppointment(appointmentId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Note added to appointment successfully',
        data: result,
    });
}));
const toggleIsNoteHidden = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentId = req.params.id;
    const result = yield appointment_service_1.AppointmentServices.toggleIsNoteHidden(appointmentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Note visibility toggled successfully',
        data: result,
    });
}));
const addPrescriptionToAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentId = req.params.id;
    const result = yield appointment_service_1.AppointmentServices.addPrescriptionToAppointment(appointmentId, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Prescription added to appointment successfully',
        data: result,
    });
}));
const appointmentStatusUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentId = req.params.id;
    const status = req.body.status;
    const result = yield appointment_service_1.AppointmentServices.appointmentStatusUpdate(appointmentId, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Appointment status updated successfully',
        data: result,
    });
}));
const doctorAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.query.status;
    const result = yield appointment_service_1.AppointmentServices.doctorAppointments(req.params.doctorId, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Doctors appointments fetched successfully',
        data: result,
    });
}));
const doctorAppointmentCounts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_service_1.AppointmentServices.doctorAppointmentCounts(req.params.doctorId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Doctors appointments count fetched successfully',
        data: result,
    });
}));
const getAllAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_service_1.AppointmentServices.getAllAppointments(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'All appointments fetched successfully',
        data: result,
    });
}));
exports.AppointmentControllers = {
    bookAppointment,
    getUserAppointments,
    getAppointmentDetails,
    reviewAppointment,
    getAllUserPrescriptions,
    addNoteToAppointment,
    toggleIsNoteHidden,
    addPrescriptionToAppointment,
    appointmentStatusUpdate,
    doctorAppointments,
    doctorAppointmentCounts,
    getAllAppointments
};
