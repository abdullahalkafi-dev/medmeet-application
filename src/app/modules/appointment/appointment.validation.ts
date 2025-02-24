import { z } from 'zod';

const createAppointmentZodSchema = z.object({
  data: z.object({
    doctor: z.string({ required_error: 'Doctor ID is required' }),
    user: z.string({ required_error: 'User ID is required' }),
    schedule: z.string({ required_error: 'Schedule ID is required' }),
    slot: z.object({
      startTime: z.string({ required_error: 'Start time is required' }),
      endTime: z.string({ required_error: 'End time is required' }),
    }),
    patientDetails: z.object({
      fullName: z.string({ required_error: 'Full name is required' }),
      gender: z.enum(['Male', 'Female', 'Other'], {
        required_error: 'Gender is required',
      }),
      age: z.number({ required_error: 'Age is required' }),
      problemDescription: z.string({
        required_error: 'Problem description is required',
      }),
    }),
    prescription: z.string().optional(),
    doctorNotes: z.string().optional(),
    attachmentImage: z.array(z.string()).optional(),
    attachmentPdf: z.array(z.string()).optional(),
    isNoteHidden: z.boolean().optional(),
    status: z.enum(['Upcoming', 'Completed', 'Cancelled']).optional(),
  }),
});

const updateAppointmentZodSchema = z.object({
  data: z.object({
    doctor: z.string().optional(),
    user: z.string().optional(),
    schedule: z.string().optional(),
    slot: z
      .object({
        startTime: z.string().optional(),
        endTime: z.string().optional(),
      })
      .optional(),
    patientDetails: z
      .object({
        fullName: z.string().optional(),
        gender: z.enum(['Male', 'Female', 'Other']).optional(),
        age: z.number().optional(),
        problemDescription: z.string().optional(),
      })
      .optional(),
    prescription: z.string().optional(),
    doctorNotes: z.string().optional(),
    attachmentImage: z.array(z.string()).optional(),
    attachmentPdf: z.array(z.string()).optional(),
    isNoteHidden: z.boolean().optional(),
    status: z.enum(['Upcoming', 'Completed', 'Cancelled']).optional(),
  }),
});

const reviewValidation = z.object({
  body: z.object({
    rating: z
      .number({ required_error: 'Rating is required' })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),

    review: z.string({ required_error: 'Review is required' }).min(6, {
      message: 'Review must be at least 6 characters long',
    }),
  }),
});

export const AppointmentValidation = {
  createAppointmentZodSchema,
  updateAppointmentZodSchema,
  reviewValidation,
};
