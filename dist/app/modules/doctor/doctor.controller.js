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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const doctor_service_1 = require("./doctor.service");
const createDoctorToDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const doctorData = __rest(req.body, []);
    const doctor = yield doctor_service_1.DoctorService.createDoctorToDB(doctorData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Doctor created successfully',
        data: doctor,
    });
}));
const loginDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uniqueId, password } = req.body;
    const doctor = yield doctor_service_1.DoctorService.loginDoctor({ uniqueId, password });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Doctor logged in successfully',
        data: doctor,
    });
}));
const getDoctorProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = req.user;
    const result = yield doctor_service_1.DoctorService.getDoctorProfileFromDB(doctor);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result,
    });
}));
const updateDoctorProfile = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = req.user;
    let image;
    let professionalIdFront;
    let professionalIdBack;
    let medicalLicense;
    if (req.files && 'image' in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    if (req.files &&
        'professionalIdFront' in req.files &&
        req.files.professionalIdFront[0]) {
        professionalIdFront = `/images/${req.files.professionalIdFront[0].filename}`;
    }
    if (req.files &&
        'professionalIdBack' in req.files &&
        req.files.professionalIdBack[0]) {
        professionalIdBack = `/images/${req.files.professionalIdBack[0].filename}`;
    }
    if (req.files &&
        'medicalLicense' in req.files &&
        req.files.medicalLicense[0]) {
        medicalLicense = `/docs/${req.files.medicalLicense[0].filename}`;
    }
    const doctorData = JSON.parse(req.body.data);
    const data = Object.assign({ image,
        professionalIdFront,
        professionalIdBack,
        medicalLicense }, doctorData);
    const result = yield doctor_service_1.DoctorService.updateDoctorProfileToDB(doctor, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result,
    });
}));
const getAllDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    if (!(req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
        req.query.approvedStatus = 'approved';
    }
    const result = yield doctor_service_1.DoctorService.getAllDoctors(req.query, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'All doctors retrieved successfully',
        data: result.result,
        pagination: result.meta,
    });
}));
const getSingleDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.DoctorService.getSingleDoctor(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Doctor retrieved successfully',
        data: result,
    });
}));
const updateDoctorApprovedStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.DoctorService.updateDoctorApprovedStatus(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Doctor approved successfully',
        data: result,
    });
}));
const deleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.DoctorService.deleteDoctor(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Doctor deleted successfully',
        data: result,
    });
}));
exports.DoctorController = {
    createDoctorToDB,
    getDoctorProfile,
    updateDoctorProfile,
    getAllDoctors,
    getSingleDoctor,
    loginDoctor,
    updateDoctorApprovedStatus,
    deleteDoctor,
};
