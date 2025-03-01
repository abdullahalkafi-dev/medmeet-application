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
exports.AppointmentServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const appointment_model_1 = require("./appointment.model");
const doctorSchedule_model_1 = require("../doctorSchedule/doctorSchedule.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const doctor_model_1 = require("../doctor/doctor.model");
const bookAppointment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentData = JSON.parse(req.body.data); // Parse JSON data from form-data
    const schedule = yield doctorSchedule_model_1.DoctorSchedule.findById(appointmentData.schedule);
    if (!schedule) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Schedule not found');
    }
    const { doctor: doctorId, user: userId, slot: { startTime, endTime }, patientDetails: { fullName, gender, age, problemDescription }, } = appointmentData;
    const user = yield user_model_1.User.findById(userId).lean().exec();
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    const slotIndex = schedule.slots.findIndex(slot => slot.startTime === startTime && slot.endTime === endTime);
    if (slotIndex === -1) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Slot not found');
    }
    if (schedule.slots[slotIndex].isBooked) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Slot already booked');
    }
    schedule.slots[slotIndex].isBooked = true;
    schedule.slots[slotIndex].bookedBy = new mongoose_1.Types.ObjectId(userId);
    yield schedule.save();
    //   Handle file uploads
    let attachmentImages = [];
    let attachmentPdfs = [];
    console.log(req.files.image);
    if (req.files) {
        if (req.files.image) {
            attachmentImages = req.files.image.map((file) => `/images/${file.filename}`);
        }
        if (req.files.doc) {
            attachmentPdfs = req.files.doc.map((file) => `/docs/${file.filename}`);
        }
    }
    const appointment = yield appointment_model_1.Appointment.create({
        doctor: doctorId,
        user: userId,
        schedule: schedule._id,
        slot: { startTime, endTime },
        patientDetails: { fullName, gender, age, problemDescription },
        attachmentImage: attachmentImages,
        attachmentPdf: attachmentPdfs,
        status: 'Upcoming',
    });
    return appointment;
});
const getUserAppointments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointment_model_1.Appointment.aggregate([
        { $match: { user: new mongoose_1.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: 'doctors',
                localField: 'doctor',
                foreignField: '_id',
                as: 'doctorDetails',
            },
        },
        { $unwind: '$doctorDetails' },
        {
            $lookup: {
                from: 'doctorschedules',
                localField: 'schedule',
                foreignField: '_id',
                as: 'scheduleDetails',
            },
        },
        { $unwind: '$scheduleDetails' },
        {
            $lookup: {
                from: 'categories',
                localField: 'doctorDetails.specialist',
                foreignField: '_id',
                as: 'specialistDetails',
            },
        },
        { $unwind: '$specialistDetails' },
        {
            $project: {
                _id: 1,
                name: '$doctorDetails.name',
                image: '$doctorDetails.image',
                specialist: '$specialistDetails.name',
                date: '$scheduleDetails.date',
                startTime: '$slot.startTime',
                endTime: '$slot.endTime',
                status: 1,
            },
        },
    ]);
    return appointments;
});
const getAppointmentDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointment_model_1.Appointment.aggregate([
        { $match: { _id: new mongoose_1.Types.ObjectId(id) } },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        { $unwind: '$userDetails' },
        {
            $lookup: {
                from: 'doctors',
                localField: 'doctor',
                foreignField: '_id',
                as: 'doctorDetails',
            },
        },
        { $unwind: '$doctorDetails' },
        {
            $lookup: {
                from: 'doctorschedules',
                localField: 'schedule',
                foreignField: '_id',
                as: 'scheduleDetails',
            },
        },
        { $unwind: '$scheduleDetails' },
        {
            $lookup: {
                from: 'categories',
                localField: 'doctorDetails.specialist',
                foreignField: '_id',
                as: 'specialistDetails',
            },
        },
        { $unwind: '$specialistDetails' },
        {
            $project: {
                _id: 1,
                doctor: {
                    name: '$doctorDetails.name',
                    image: '$doctorDetails.image',
                    country: '$doctorDetails.country',
                    aboutDoctor: '$doctorDetails.aboutDoctor',
                    clinic: '$doctorDetails.clinic',
                    clinicAddress: '$doctorDetails.clinicAddress',
                    experience: '$doctorDetails.experience',
                    specialist: '$specialistDetails.name',
                    consultationFee: '$doctorDetails.consultationFee',
                },
                date: '$scheduleDetails.date',
                startTime: '$slot.startTime',
                endTime: '$slot.endTime',
                user: {
                    name: '$userDetails.name',
                    country: '$userDetails.country',
                    phoneNumber: '$userDetails.phoneNumber',
                    image: '$userDetails.image',
                },
                prescription: 1,
                doctorNote: 1,
                patientDetails: 1,
                attachmentImage: 1,
                attachmentPdf: 1,
                review: 1,
                status: 1,
            },
        },
    ]);
    const appointment = appointments[0];
    if (!appointment.review) {
        appointment.review = null;
    }
    return appointment;
});
const reviewAppointment = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isValidUserForReview = yield appointment_model_1.Appointment.findOne({
        _id: id,
        user: userId,
    });
    if (!isValidUserForReview) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You are not allowed to review this appointment');
    }
    const appointment = yield appointment_model_1.Appointment.findByIdAndUpdate(id, { review: Object.assign(Object.assign({}, payload), { createdAt: new Date() }) }, { new: true });
    if (!appointment) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Appointment not found');
    }
    const avgRating = yield appointment_model_1.Appointment.aggregate([
        {
            $match: { doctor: appointment.doctor },
        },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$review.rating' },
            },
        },
    ]);
    const newAvgRating = ((_a = avgRating[0]) === null || _a === void 0 ? void 0 : _a.avgRating)
        ? parseFloat(avgRating[0].avgRating.toFixed(1))
        : 0;
    yield doctor_model_1.Doctor.findByIdAndUpdate(appointment.doctor, {
        avgRating: newAvgRating,
    });
    return appointment;
});
const getAllUserPrescriptions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointment_model_1.Appointment.aggregate([
        { $match: { user: new mongoose_1.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: 'doctors',
                localField: 'doctor',
                foreignField: '_id',
                as: 'doctorDetails',
            },
        },
        { $unwind: '$doctorDetails' },
        {
            $lookup: {
                from: 'categories',
                localField: 'doctorDetails.specialist',
                foreignField: '_id',
                as: 'specialistDetails',
            },
        },
        { $unwind: '$specialistDetails' },
        {
            $project: {
                _id: 1,
                name: '$doctorDetails.name',
                image: '$doctorDetails.image',
                specialist: '$specialistDetails.name',
                avgRating: '$doctorDetails.avgRating',
                consultationFee: '$doctorDetails.consultationFee',
                date: 1,
                startTime: '$slot.startTime',
                endTime: '$slot.endTime',
                status: 1,
                prescription: 1,
                notes: 1,
            },
        },
    ]);
    return appointments;
});
const addNoteToAppointment = (appointmentId, note) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.Appointment.findByIdAndUpdate(appointmentId, { doctorNote: note.note }, { new: true, upsert: true });
    return appointment;
});
const toggleIsNoteHidden = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.Appointment.findById(appointmentId);
    if (!appointment) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Appointment not found');
    }
    appointment.isNoteHidden = !appointment.isNoteHidden;
    yield appointment.save();
    return appointment;
});
const addPrescriptionToAppointment = (appointmentId, req) => __awaiter(void 0, void 0, void 0, function* () {
    let attachmentPdf;
    if (req.files.doc) {
        attachmentPdf = `/docs/${req.files.doc[0].filename}`;
    }
    console.log(attachmentPdf);
    const appointment = yield appointment_model_1.Appointment.findByIdAndUpdate(appointmentId, { prescription: attachmentPdf }, { new: true, upsert: true });
    return appointment;
});
const appointmentStatusUpdate = (appointmentId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
    return appointment;
});
const doctorAppointments = (doctorId, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (!doctorId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Doctor Id is required');
    }
    let queries = [{ doctor: new mongoose_1.Types.ObjectId(doctorId) }];
    if (status) {
        queries.push({ status: status });
    }
    const appointments = yield appointment_model_1.Appointment.aggregate([
        { $match: { $and: queries } },
        {
            $lookup: {
                from: 'doctors',
                localField: 'doctor',
                foreignField: '_id',
                as: 'doctorDetails',
            },
        },
        { $unwind: '$doctorDetails' },
        {
            $lookup: {
                from: 'doctorschedules',
                localField: 'schedule',
                foreignField: '_id',
                as: 'scheduleDetails',
            },
        },
        { $unwind: '$scheduleDetails' },
        {
            $lookup: {
                from: 'categories',
                localField: 'doctorDetails.specialist',
                foreignField: '_id',
                as: 'specialistDetails',
            },
        },
        { $unwind: '$specialistDetails' },
        {
            $project: {
                _id: 1,
                name: '$doctorDetails.name',
                image: '$doctorDetails.image',
                specialist: '$specialistDetails.name',
                date: '$scheduleDetails.date',
                startTime: '$slot.startTime',
                endTime: '$slot.endTime',
                status: 1,
            },
        },
    ]);
    return appointments;
});
const doctorAppointmentCounts = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    const upcoming = yield appointment_model_1.Appointment.countDocuments({
        doctor: doctorId,
        status: 'Upcoming',
    });
    const completed = yield appointment_model_1.Appointment.countDocuments({
        doctor: doctorId,
        status: 'Completed',
    });
    const cancelled = yield appointment_model_1.Appointment.countDocuments({
        doctor: doctorId,
        status: 'Cancelled',
    });
    return { upcoming, completed, cancelled, total: upcoming + completed + cancelled };
});
exports.AppointmentServices = {
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
};
