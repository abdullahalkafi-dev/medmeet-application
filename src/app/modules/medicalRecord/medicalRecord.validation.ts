import { Types } from 'mongoose';
import { z } from 'zod';

const createMedicalRecordValidation = z.object({
  data: z.object({
    name: z.string().refine(data => data.trim() !== '', {
      message: 'Name is required',
    }),
    age: z.number().refine(data => data > 0, {
      message: 'Age must be greater than 0',
    }),
    gender: z.enum(['Male', 'Female', 'Other'], {
      message: 'Gender must be one of Male, Female, or Other',
    }),
    medicalHistory: z.string().refine(data => data.trim() !== '', {
      message: 'Medical history is required',
    }),
    user: z.string().refine(data => Types.ObjectId.isValid(data), {
      message: 'User ID must be a valid ObjectId',
    }),
  }),
});
const updateMedicalRecordValidation = z.object({
  data: z.object({
    name: z
      .string()
      .refine(data => data.trim() !== '', {
        message: 'Name is required',
      })
      .optional(),
    age: z
      .number()
      .refine(data => data > 0, {
        message: 'Age must be greater than 0',
      })
      .optional(),
    gender: z
      .enum(['Male', 'Female', 'Other'], {
        message: 'Gender must be one of Male, Female, or Other',
      })
      .optional(),
    medicalHistory: z.string().refine(data => data.trim() !== '', {
      message: 'Medical history is required',
    }),
    user: z
      .string()
      .refine(data => Types.ObjectId.isValid(data), {
        message: 'User ID must be a valid ObjectId',
      })
      .optional(),
  }),
});

export const MedicalRecordValidation = {
  createMedicalRecordValidation,
  updateMedicalRecordValidation,
};
