"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentValidation = void 0;
const zod_1 = require("zod");
const createAppointmentZodSchema = zod_1.z.object({
    data: zod_1.z.object({
        doctor: zod_1.z.string({ required_error: 'Doctor ID is required' }),
        user: zod_1.z.string({ required_error: 'User ID is required' }),
        schedule: zod_1.z.string({ required_error: 'Schedule ID is required' }),
        slot: zod_1.z.object({
            startTime: zod_1.z.string({ required_error: 'Start time is required' }),
            endTime: zod_1.z.string({ required_error: 'End time is required' }),
        }),
        patientDetails: zod_1.z.object({
            fullName: zod_1.z.string({ required_error: 'Full name is required' }),
            gender: zod_1.z.enum(['Male', 'Female', 'Other'], {
                required_error: 'Gender is required',
            }),
            age: zod_1.z.number({ required_error: 'Age is required' }),
            problemDescription: zod_1.z.string({
                required_error: 'Problem description is required',
            }),
        }),
        prescription: zod_1.z.string().optional(),
        doctorNotes: zod_1.z.string().optional(),
        attachmentImage: zod_1.z.array(zod_1.z.string()).optional(),
        attachmentPdf: zod_1.z.array(zod_1.z.string()).optional(),
        isNoteHidden: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(['Upcoming', 'Completed', 'Cancelled']).optional(),
    }),
});
const updateAppointmentZodSchema = zod_1.z.object({
    data: zod_1.z.object({
        doctor: zod_1.z.string().optional(),
        user: zod_1.z.string().optional(),
        schedule: zod_1.z.string().optional(),
        slot: zod_1.z
            .object({
            startTime: zod_1.z.string().optional(),
            endTime: zod_1.z.string().optional(),
        })
            .optional(),
        patientDetails: zod_1.z
            .object({
            fullName: zod_1.z.string().optional(),
            gender: zod_1.z.enum(['Male', 'Female', 'Other']).optional(),
            age: zod_1.z.number().optional(),
            problemDescription: zod_1.z.string().optional(),
        })
            .optional(),
        prescription: zod_1.z.string().optional(),
        doctorNotes: zod_1.z.string().optional(),
        attachmentImage: zod_1.z.array(zod_1.z.string()).optional(),
        attachmentPdf: zod_1.z.array(zod_1.z.string()).optional(),
        isNoteHidden: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(['Upcoming', 'Completed', 'Cancelled']).optional(),
    }),
});
const reviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z
            .number({ required_error: 'Rating is required' })
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating must be at most 5'),
        review: zod_1.z.string({ required_error: 'Review is required' }).min(1, {
            message: 'Review must be at least 6 characters long',
        }),
    }),
});
const addNoteValidation = zod_1.z.object({
    body: zod_1.z.object({
        note: zod_1.z.string({ required_error: 'Note is required' }),
    }),
});
const appointmentStatusUpdateValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['Upcoming', 'Completed', 'Cancelled'], {
            required_error: 'Status is required',
        }),
    }),
});
exports.AppointmentValidation = {
    createAppointmentZodSchema,
    updateAppointmentZodSchema,
    reviewValidation,
    addNoteValidation,
    appointmentStatusUpdateValidation
};
