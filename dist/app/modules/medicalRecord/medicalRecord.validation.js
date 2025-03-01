"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordValidation = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const createMedicalRecordValidation = zod_1.z.object({
    data: zod_1.z.object({
        name: zod_1.z.string().refine(data => data.trim() !== '', {
            message: 'Name is required',
        }),
        age: zod_1.z.number().refine(data => data > 0, {
            message: 'Age must be greater than 0',
        }),
        gender: zod_1.z.enum(['Male', 'Female', 'Other'], {
            message: 'Gender must be one of Male, Female, or Other',
        }),
        medicalHistory: zod_1.z.string().refine(data => data.trim() !== '', {
            message: 'Medical history is required',
        }),
        user: zod_1.z.string().refine(data => mongoose_1.Types.ObjectId.isValid(data), {
            message: 'User ID must be a valid ObjectId',
        }),
    }),
});
const updateMedicalRecordValidation = zod_1.z.object({
    data: zod_1.z.object({
        name: zod_1.z
            .string()
            .refine(data => data.trim() !== '', {
            message: 'Name is required',
        })
            .optional(),
        age: zod_1.z
            .number()
            .refine(data => data > 0, {
            message: 'Age must be greater than 0',
        })
            .optional(),
        gender: zod_1.z
            .enum(['Male', 'Female', 'Other'], {
            message: 'Gender must be one of Male, Female, or Other',
        })
            .optional(),
        medicalHistory: zod_1.z.string().refine(data => data.trim() !== '', {
            message: 'Medical history is required',
        }),
        user: zod_1.z
            .string()
            .refine(data => mongoose_1.Types.ObjectId.isValid(data), {
            message: 'User ID must be a valid ObjectId',
        })
            .optional(),
    }),
});
exports.MedicalRecordValidation = {
    createMedicalRecordValidation,
    updateMedicalRecordValidation,
};
