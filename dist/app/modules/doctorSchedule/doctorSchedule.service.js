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
exports.DoctorScheduleService = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const doctorSchedule_model_1 = require("./doctorSchedule.model");
const createDoctorSchedule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, date, slots } = payload;
    // Validate slots format and ensure each slot is 30 minutes long and starts/ends on the hour or half-hour
    slots.forEach(slot => {
        if (!slot.startTime || !slot.endTime) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid slot format');
        }
        const start = new Date(`1970-01-01T${slot.startTime}:00Z`);
        const end = new Date(`1970-01-01T${slot.endTime}:00Z`);
        const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        console.log(diffMinutes);
        if (diffMinutes !== 30) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Each slot must be 30 minutes long');
        }
        const validMinutes = [0, 30];
        if (!validMinutes.includes(start.getUTCMinutes()) ||
            !validMinutes.includes(end.getUTCMinutes())) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Slots must start and end on the hour or half-hour');
        }
    });
    // Find existing schedule for the doctor on the same date
    const existingSchedule = yield doctorSchedule_model_1.DoctorSchedule.findOne({
        doctor: doctorId,
        date: new Date(date.split('-').reverse().join('-')),
    });
    if (existingSchedule) {
        // Merge new slots with existing slots, ensuring no duplicate time slots
        const newSlots = slots.filter(newSlot => !existingSchedule.slots.some(existingSlot => existingSlot.startTime === newSlot.startTime &&
            existingSlot.endTime === newSlot.endTime));
        existingSchedule.slots.push(...newSlots);
        yield existingSchedule.save();
        return existingSchedule;
    }
    // If no existing schedule, create a new one
    const newSchedule = yield doctorSchedule_model_1.DoctorSchedule.create({
        doctor: new mongoose_1.Types.ObjectId(doctorId),
        date: new Date(date.split('-').reverse().join('-')),
        slots,
    });
    return newSchedule;
});
const getDoctorSchedules = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield doctorSchedule_model_1.DoctorSchedule.find({ doctor: doctorId }).lean();
});
const getAvailableSlots = (doctorId, date) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = yield doctorSchedule_model_1.DoctorSchedule.findOne({
        doctor: doctorId,
        date: new Date(date.split('-').reverse().join('-')),
    }).lean();
    if (!schedule)
        return null;
    return {
        schedule: schedule._id,
        date: schedule.date.toISOString(),
        slots: schedule.slots.filter(slot => !slot.isBooked),
    };
});
exports.DoctorScheduleService = {
    createDoctorSchedule,
    getDoctorSchedules,
    getAvailableSlots,
};
