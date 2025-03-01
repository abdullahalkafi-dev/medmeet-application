"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorValidation = void 0;
const zod_1 = require("zod");
const user_1 = require("../../../enums/user");
const createDoctorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format'),
        doctorId: zod_1.z.string({ required_error: 'Doctor ID is required' }),
        country: zod_1.z.string({ required_error: 'Country is required' }),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters long'),
    }),
});
const updateDoctorZodSchema = zod_1.z.object({
    data: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        role: zod_1.z
            .enum(Object.values(user_1.USER_ROLES))
            .optional(),
        email: zod_1.z.string().optional(),
        doctorId: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        gender: zod_1.z.enum(['Male', 'Female']).optional(),
        dob: zod_1.z
            .string()
            .regex(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, 'Date of birth must be in DD-MM-YYYY format')
            .optional(),
        country: zod_1.z.string().optional(),
        specialist: zod_1.z.string().optional(),
        experience: zod_1.z.number().optional(),
        clinic: zod_1.z.string().optional(),
        clinicAddress: zod_1.z.string().optional(),
        consultationFee: zod_1.z.number().optional(),
        aboutDoctor: zod_1.z.string().optional(),
        professionalIdFront: zod_1.z.string().optional(),
        professionalIdBack: zod_1.z.string().optional(),
        medicalLicense: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        subscription: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(['active', 'delete']).optional(),
        verified: zod_1.z.boolean().optional(),
        approvedStatus: zod_1.z.enum(['pending', 'approved', 'rejected']).optional(),
        authentication: zod_1.z
            .object({
            isResetPassword: zod_1.z.boolean().optional(),
            oneTimeCode: zod_1.z.number().nullable().optional(),
            expireAt: zod_1.z.date().nullable().optional(),
        })
            .optional(),
    })
        .refine(data => {
        return !(data.email ||
            data.doctorId ||
            data.approvedStatus ||
            data.verified ||
            data.authentication ||
            data.subscription);
    }, {
        message: 'Those fields are not allowed to update',
        path: ['data'],
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        uniqueId: zod_1.z.string({ required_error: 'Email or Doctor ID is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(8, {
            message: 'Password must be at least 8 characters long',
        }),
    }),
});
exports.DoctorValidation = {
    createDoctorZodSchema,
    updateDoctorZodSchema,
    loginZodSchema,
};
