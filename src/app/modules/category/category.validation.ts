import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
  }),
});

const updateCategoryZodSchema = z.object({
  data: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
  }),

});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
