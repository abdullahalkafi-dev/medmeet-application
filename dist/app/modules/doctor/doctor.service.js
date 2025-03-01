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
exports.DoctorService = void 0;
const http_status_codes_1 = require("http-status-codes");
const doctor_model_1 = require("./doctor.model");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const appointment_model_1 = require("../appointment/appointment.model");
const createDoctorToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate required fields
    const isExist = yield doctor_model_1.Doctor.findOne({
        $or: [{ email: payload.email }, { doctorId: payload.doctorId }],
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Doctor already exist');
    }
    // Create doctor first
    const doctor = yield doctor_model_1.Doctor.create(payload);
    return doctor;
});
const loginDoctor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { uniqueId, password } = payload;
    const doctor = yield doctor_model_1.Doctor.findOne({
        $or: [{ email: uniqueId }, { doctorId: uniqueId }],
    }).select('+password');
    if (!doctor) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Doctor not found');
    }
    const isMatch = yield doctor_model_1.Doctor.isMatchPassword(password, doctor.password);
    if (!isMatch) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid credentials');
    }
    const accessToken = jwtHelper_1.jwtHelper.createToken({
        id: doctor._id,
        role: doctor.role,
        email: doctor.email,
        approvedStatus: doctor.approvedStatus,
    }, config_1.default.jwt.jwt_secret, '90d');
    //create token
    const refreshToken = jwtHelper_1.jwtHelper.createToken({ id: doctor._id, role: doctor.role, email: doctor.email }, config_1.default.jwt.jwt_refresh_secret, '150d');
    const _a = doctor.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return { accessToken, refreshToken, user: userWithoutPassword };
});
const getDoctorProfileFromDB = (doctor) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = doctor;
    const isExistDoctor = yield doctor_model_1.Doctor.findById(id).populate('specialist').lean();
    if (!isExistDoctor) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Doctor doesn't exist!");
    }
    const reviews = yield appointment_model_1.Appointment.find({ doctor: id })
        .populate({
        path: 'user',
        select: 'name country image',
    })
        .select('review')
        .lean();
    const result = Object.assign(Object.assign({}, isExistDoctor), { reviews: reviews.map((review) => ({
            rating: review.review.rating,
            review: review.review.review,
            createdAt: review.review.createdAt,
            _id: review._id,
            name: review.user.name,
            country: review.user.country,
            image: review.user.image,
        })) });
    return result;
});
const updateDoctorProfileToDB = (doctorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = doctorId;
    const isExistDoctor = yield doctor_model_1.Doctor.isExistDoctorById(id);
    if (!isExistDoctor) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Doctor doesn't exist!");
    }
    if (payload.image &&
        isExistDoctor.image &&
        !isExistDoctor.image.includes('default_profile.jpg') &&
        !payload.image.includes(isExistDoctor.image)) {
        (0, unlinkFile_1.default)(isExistDoctor.image);
    }
    if (payload.professionalIdFront && isExistDoctor.professionalIdFront) {
        (0, unlinkFile_1.default)(isExistDoctor.professionalIdFront);
    }
    if (payload.professionalIdBack && isExistDoctor.professionalIdBack) {
        (0, unlinkFile_1.default)(isExistDoctor.professionalIdBack);
    }
    if (payload.medicalLicense && isExistDoctor.medicalLicense) {
        (0, unlinkFile_1.default)(isExistDoctor.medicalLicense);
    }
    if (payload.dob) {
        const [day, month, year] = payload.dob.split('-');
        payload.dob = new Date(`${year}-${month}-${day}`);
        console.log(payload.dob);
    }
    const updateDoc = yield doctor_model_1.Doctor.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        upsert: true,
    });
    if (!updateDoc.isAllFieldsFilled &&
        updateDoc &&
        !!(updateDoc.specialist &&
            updateDoc.experience &&
            updateDoc.clinic &&
            updateDoc.clinicAddress &&
            updateDoc.consultationFee &&
            updateDoc.aboutDoctor &&
            updateDoc.professionalIdFront &&
            updateDoc.professionalIdBack &&
            updateDoc.medicalLicense)) {
        return yield doctor_model_1.Doctor.findOneAndUpdate({ _id: id }, { isAllFieldsFilled: true }, { new: true });
    }
    return updateDoc;
});
const getSingleDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(id).populate('specialist').lean();
    const appointments = yield appointment_model_1.Appointment.find({ doctor: id })
        .populate({
        path: 'user',
        select: 'name country image',
    })
        .select('review')
        .lean();
    const TotalPatientsCount = new Set(appointments.map((review) => review.user._id)).size || 0;
    const withReviewsAppointment = appointments.filter((appointment) => appointment.review);
    const result = Object.assign(Object.assign({}, doctor), { TotalPatientsCount, reviews: withReviewsAppointment.map((review) => {
            var _a, _b, _c;
            return ({
                rating: (_a = review === null || review === void 0 ? void 0 : review.review) === null || _a === void 0 ? void 0 : _a.rating,
                review: (_b = review === null || review === void 0 ? void 0 : review.review) === null || _b === void 0 ? void 0 : _b.review,
                createdAt: (_c = review === null || review === void 0 ? void 0 : review.review) === null || _c === void 0 ? void 0 : _c.createdAt,
                _id: review._id,
                name: review.user.name,
                country: review.user.country,
                image: review.user.image,
            });
        }) });
    return result;
});
//get all doctors
const getAllDoctors = (query, req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let dirQuery = {};
    if (user.role === 'DOCTOR') {
        dirQuery = { _id: { $ne: req.user.id } };
    }
    const doctorQuery = new QueryBuilder_1.QueryBuilder(doctor_model_1.Doctor.find(dirQuery).populate('specialist'), query)
        .search(['name', 'country', 'clinic'])
        .filter()
        .sort()
        .paginate()
        .fields();
    let result = yield doctorQuery.modelQuery;
    const meta = yield doctorQuery.countTotal();
    return { result, meta };
});
const updateDoctorApprovedStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(id);
    const status = ['pending', 'approved', 'rejected'];
    if (!status.includes(payload.status)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid status');
    }
    if (!doctor) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Doctor not found!');
    }
    const updatedDoctor = yield doctor_model_1.Doctor.findByIdAndUpdate(id, { approvedStatus: payload.status }, { new: true });
    return updatedDoctor;
});
const deleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_model_1.Doctor.findByIdAndUpdate(id, { status: 'delete' }, { new: true });
    return result;
});
exports.DoctorService = {
    getDoctorProfileFromDB,
    updateDoctorProfileToDB,
    getSingleDoctor,
    createDoctorToDB,
    getAllDoctors,
    loginDoctor,
    updateDoctorApprovedStatus,
    deleteDoctor,
};
