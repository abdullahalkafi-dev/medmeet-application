import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// Function to validate date format and future date check
// Enable the plugin to support custom date formats
dayjs.extend(customParseFormat);
const isValidFutureDate = (date: string): boolean => {
    console.log('Received Date:', date);
  
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Ensure the format is DD-MM-YYYY
    if (!dateRegex.test(date)) {
      console.log('Invalid Format');
      return false;
    }
  
    const parsedDate = dayjs(date, 'DD-MM-YYYY', true); // Parse date strictly with the correct format
    console.log('Parsed Date:', parsedDate.format()); // Debugging
  
    if (!parsedDate.isValid()) {
      console.log('Invalid Date');
      return false;
    }
  
    if (parsedDate.isBefore(dayjs(), 'day')) {
      console.log('Date is in the past');
      return false;
    }
  
    return true;
  };

const createDoctorScheduleZodSchema = z.object({
  body: z.object({
    doctorId: z.string({ required_error: 'Doctor ID is required' }),
    date: z
      .string({ required_error: 'Date is required' })
      .refine(isValidFutureDate, {
        message: 'Date must be in DD-MM-YYYY format and must be in the future',
      }),
    slots: z.array(
      z.object({
        startTime: z.string({ required_error: 'Start time is required' }),
        endTime: z.string({ required_error: 'End time is required' }),
        isBooked: z.boolean().default(false),
      })
    ),
  }),
});

const bookAppointmentZodSchema = z.object({
  body: z.object({
    doctorId: z.string({ required_error: 'Doctor ID is required' }),
    date: z
      .string({ required_error: 'Date is required' })
      .refine(isValidFutureDate, {
        message: 'Date must be in DD-MM-YYYY format and must be in the future',
      }),
    slotIndex: z
      .number({ required_error: 'Slot index is required' })
      .nonnegative(),
    userId: z.string({ required_error: 'User ID is required' }),
  }),
});

const cancelAppointmentZodSchema = z.object({
  body: z.object({
    doctorId: z.string({ required_error: 'Doctor ID is required' }),
    date: z
      .string({ required_error: 'Date is required' })
      .refine(isValidFutureDate, {
        message: 'Date must be in DD-MM-YYYY format and must be in the future',
      }),
    slotIndex: z
      .number({ required_error: 'Slot index is required' })
      .nonnegative(),
    userId: z.string({ required_error: 'User ID is required' }),
  }),
});

export const DoctorScheduleValidation = {
  createDoctorScheduleZodSchema,
  bookAppointmentZodSchema,
  cancelAppointmentZodSchema,
};
