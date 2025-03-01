"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordModel = void 0;
const mongoose_1 = require("mongoose");
const medicalRecordSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    medicalHistory: {
        type: String,
        required: true,
    },
    prescription: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
exports.MedicalRecordModel = (0, mongoose_1.model)('MedicalRecord', medicalRecordSchema);
