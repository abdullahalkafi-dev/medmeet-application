"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorSchedule = void 0;
const mongoose_1 = require("mongoose");
const SlotSchema = new mongoose_1.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
});
const DoctorScheduleSchema = new mongoose_1.Schema({
    doctor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    slots: [SlotSchema],
});
exports.DoctorSchedule = (0, mongoose_1.model)('DoctorSchedule', DoctorScheduleSchema);
