import { z } from 'zod';
import { USER_ROLES } from '../../../enums/user';

const createDoctorZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    doctorId: z.string({ required_error: 'Doctor ID is required' }),
    country: z.string({ required_error: 'Country is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
  }),
});

const updateDoctorZodSchema = z.object({
  data: z
    .object({
      name: z.string().optional(),
      role: z
        .enum(Object.values(USER_ROLES) as [string, ...string[]])
        .optional(),
      email: z.string().optional(),
      doctorId: z.string().optional(),
      phoneNumber: z.string().optional(),
      gender: z.enum(['male', 'female']).optional(),
      dob: z.string().optional(),
      country: z.string().optional(),
      specialist: z.string().optional(),
      experience: z.number().optional(),
      clinic: z.string().optional(),
      clinicAddress: z.string().optional(),
      consultationFee: z.number().optional(),
      aboutDoctor: z.string().optional(),
      professionalIdFront: z.string().optional(),
      professionalIdBack: z.string().optional(),
      medicalLicense: z.string().optional(),
      image: z.string().optional(),
      subscription: z.boolean().optional(),
      status: z.enum(['active', 'delete']).optional(),
      verified: z.boolean().optional(),
      approvedStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
      authentication: z
        .object({
          isResetPassword: z.boolean().optional(),
          oneTimeCode: z.number().nullable().optional(),
          expireAt: z.date().nullable().optional(),
        })
        .optional(),
    })
    .refine(
      data => {
        return !(
          data.email ||
          data.doctorId ||
          data.approvedStatus ||
          data.verified ||
          data.authentication ||
          data.status
        );
      },
      {
        message: 'Those fields are not allowed to update',
        path: ['data'],
      }
    ),
});
const loginZodSchema = z.object({
  body: z.object({
    uniqueId: z.string({ required_error: 'Email or Doctor ID is required' }),
    password: z.string({ required_error: 'Password is required' }).min(8, {
      message: 'Password must be at least 8 characters long',
    }),
  }),
});
export const DoctorValidation = {
  createDoctorZodSchema,
  updateDoctorZodSchema,
  loginZodSchema,
};
