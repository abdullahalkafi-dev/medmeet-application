import { z } from 'zod';

const createSettingZodSchema = z.object({
  body: z.object({
    privacyPolicy: z.string({ required_error: 'Privacy Policy is required' }),
    termsAndConditions: z.string({
      required_error: 'Terms and Conditions is required',
    }),
    aboutUs: z.string({ required_error: 'About Us is required' }),
  }),
});

const updateSettingZodSchema = z.object({
  body: z.object({
    privacyPolicy: z
      .string({ required_error: 'Privacy Policy is required' })
      .optional(),
    termsAndConditions: z
      .string({ required_error: 'Terms and Conditions is required' })
      .optional(),
    aboutUs: z.string({ required_error: 'About Us is required' }).optional(),
  }),
});

export const SettingValidation = {
  createSettingZodSchema,
  updateSettingZodSchema,
};
