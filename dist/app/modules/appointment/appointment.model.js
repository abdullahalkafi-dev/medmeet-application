"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const appointmentSchema = new mongoose_1.Schema({
    doctor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    schedule: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'DoctorSchedule',
        required: true,
    },
    slot: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
    },
    patientDetails: {
        fullName: { type: String, required: true },
        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female', 'Other'],
        },
        age: { type: Number, required: true },
        problemDescription: { type: String, required: true },
    },
    prescription: { type: String },
    doctorNote: { type: String, default: '' },
    attachmentImage: { type: [String], default: [] }, // Store multiple image URLs
    attachmentPdf: { type: [String], default: [] }, // Store multiple PDF URLs
    isNoteHidden: { type: Boolean, default: true },
    review: {
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        createdAt: { type: Date },
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Completed', 'Cancelled'],
        default: 'Upcoming',
    },
}, { timestamps: true });
exports.Appointment = (0, mongoose_1.model)('Appointment', appointmentSchema);
