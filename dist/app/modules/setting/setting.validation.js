"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingValidation = void 0;
const zod_1 = require("zod");
const createSettingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        privacyPolicy: zod_1.z.string({ required_error: 'Privacy Policy is required' }),
        termsAndConditions: zod_1.z.string({
            required_error: 'Terms and Conditions is required',
        }),
        aboutUs: zod_1.z.string({ required_error: 'About Us is required' }),
    }),
});
const updateSettingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        privacyPolicy: zod_1.z
            .string({ required_error: 'Privacy Policy is required' })
            .optional(),
        termsAndConditions: zod_1.z
            .string({ required_error: 'Terms and Conditions is required' })
            .optional(),
        aboutUs: zod_1.z.string({ required_error: 'About Us is required' }).optional(),
    }),
});
exports.SettingValidation = {
    createSettingZodSchema,
    updateSettingZodSchema,
};
