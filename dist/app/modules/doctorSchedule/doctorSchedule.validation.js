"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleValidation = void 0;
const zod_1 = require("zod");
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
// Function to validate date format and future date check
// Enable the plugin to support custom date formats
dayjs_1.default.extend(customParseFormat_1.default);
const isValidFutureDate = (date) => {
    console.log('Received Date:', date);
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Ensure the format is DD-MM-YYYY
    if (!dateRegex.test(date)) {
        console.log('Invalid Format');
        return false;
    }
    const parsedDate = (0, dayjs_1.default)(date, 'DD-MM-YYYY', true); // Parse date strictly with the correct format
    console.log('Parsed Date:', parsedDate.format()); // Debugging
    if (!parsedDate.isValid()) {
        console.log('Invalid Date');
        return false;
    }
    if (parsedDate.isBefore((0, dayjs_1.default)(), 'day')) {
        console.log('Date is in the past');
        return false;
    }
    return true;
};
const createDoctorScheduleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        doctorId: zod_1.z.string({ required_error: 'Doctor ID is required' }),
        date: zod_1.z
            .string({ required_error: 'Date is required' })
            .refine(isValidFutureDate, {
            message: 'Date must be in DD-MM-YYYY format and must be in the future',
        }),
        slots: zod_1.z.array(zod_1.z.object({
            startTime: zod_1.z.string({ required_error: 'Start time is required' }),
            endTime: zod_1.z.string({ required_error: 'End time is required' }),
            isBooked: zod_1.z.boolean().default(false),
        })),
    }),
});
const bookAppointmentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        doctorId: zod_1.z.string({ required_error: 'Doctor ID is required' }),
        date: zod_1.z
            .string({ required_error: 'Date is required' })
            .refine(isValidFutureDate, {
            message: 'Date must be in DD-MM-YYYY format and must be in the future',
        }),
        startTime: zod_1.z.string({ required_error: 'Start time is required' }),
        endTime: zod_1.z.string({ required_error: 'End time is required' }),
        userId: zod_1.z.string({ required_error: 'User ID is required' }),
    }),
});
const cancelAppointmentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        doctorId: zod_1.z.string({ required_error: 'Doctor ID is required' }),
        date: zod_1.z
            .string({ required_error: 'Date is required' })
            .refine(isValidFutureDate, {
            message: 'Date must be in DD-MM-YYYY format and must be in the future',
        }),
        slotIndex: zod_1.z
            .number({ required_error: 'Slot index is required' })
            .nonnegative(),
        userId: zod_1.z.string({ required_error: 'User ID is required' }),
    }),
});
exports.DoctorScheduleValidation = {
    createDoctorScheduleZodSchema,
    bookAppointmentZodSchema,
    cancelAppointmentZodSchema,
};
