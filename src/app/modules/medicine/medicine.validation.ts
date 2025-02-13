import { z } from 'zod';


const createMedicineZodValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Medicine name is required' }),
  }),
});

const updateMedicineZodValidation = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const MedicineValidation = {
    createMedicineZodValidation,
    updateMedicineZodValidation,
    };