"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_1 = require("../../../enums/user");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format'),
        country: zod_1.z.string({ required_error: 'Country is required' }),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters long'),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    data: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        role: zod_1.z
            .enum(Object.values(user_1.USER_ROLES))
            .optional(),
        email: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        gender: zod_1.z.enum(['Male', 'Female']).optional(),
        dob: zod_1.z
            .string()
            .regex(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, 'Date of birth must be in DD-MM-YYYY format')
            .optional(),
        country: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        subscription: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(['active', 'delete']).optional(),
        verified: zod_1.z.boolean().optional(),
        authentication: zod_1.z
            .object({
            isResetPassword: zod_1.z.boolean().optional(),
            oneTimeCode: zod_1.z.number().nullable().optional(),
            expireAt: zod_1.z.date().nullable().optional(),
        })
            .optional(),
    })
        .refine(data => !data.email, {
        message: 'Email cannot be updated',
        path: ['body'],
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        uniqueId: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(8, {
            message: 'Password must be at least 8 characters long',
        }),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    updateUserZodSchema,
    loginZodSchema,
};
