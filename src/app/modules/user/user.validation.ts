import { z } from 'zod';
import { USER_ROLES } from '../../../enums/user';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),

    country: z.string({ required_error: 'Country is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
  }),
});

const updateUserZodSchema = z.object({
  data: z
    .object({
      name: z.string().optional(),
      role: z
        .enum(Object.values(USER_ROLES) as [string, ...string[]])
        .optional(),
      email: z.string().optional(),

      phoneNumber: z.string().optional(),
      gender: z.enum(['male', 'female']).optional(),
      dob: z.string().optional(),
      country: z.string().optional(),
      image: z.string().optional(),
      subscription: z.boolean().optional(),
      status: z.enum(['active', 'delete']).optional(),
      verified: z.boolean().optional(),
      authentication: z
        .object({
          isResetPassword: z.boolean().optional(),
          oneTimeCode: z.number().nullable().optional(),
          expireAt: z.date().nullable().optional(),
        })
        .optional(),
    })
    .refine(data => !data.email, {
      message: 'Email cannot be updated',
      path: ['body'],
    }),
});
const loginZodSchema = z.object({
  body: z.object({
    uniqueId: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }).min(8, {
      message: 'Password must be at least 8 characters long',
    }),
  }),
});

export const UserValidation = {

  createUserZodSchema,
  updateUserZodSchema,
  loginZodSchema,
};
