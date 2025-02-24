import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { DoctorSchedule } from './doctorSchedule.model';
import { TSlot } from './doctorSchedule.interface';

const createDoctorSchedule = async (payload: {
  doctorId: string;
  date: string;
  slots: TSlot[];
}) => {
  const { doctorId, date, slots } = payload;

  // Validate slots format and ensure each slot is 30 minutes long and starts/ends on the hour or half-hour
  slots.forEach(slot => {
    if (!slot.startTime || !slot.endTime) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid slot format');
    }

    const start = new Date(`1970-01-01T${slot.startTime}:00Z`);
    const end = new Date(`1970-01-01T${slot.endTime}:00Z`);
    const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    console.log(diffMinutes);
    if (diffMinutes !== 30) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Each slot must be 30 minutes long'
      );
    }

    const validMinutes = [0, 30];
    if (
      !validMinutes.includes(start.getUTCMinutes()) ||
      !validMinutes.includes(end.getUTCMinutes())
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Slots must start and end on the hour or half-hour'
      );
    }
  });

  // Find existing schedule for the doctor on the same date
  const existingSchedule = await DoctorSchedule.findOne({
    doctor: doctorId,
    date: new Date(date.split('-').reverse().join('-')),
  });

  if (existingSchedule) {
    // Merge new slots with existing slots, ensuring no duplicate time slots
    const newSlots = slots.filter(
      newSlot =>
        !existingSchedule.slots.some(
          existingSlot =>
            existingSlot.startTime === newSlot.startTime &&
            existingSlot.endTime === newSlot.endTime
        )
    );
    existingSchedule.slots.push(...newSlots);
    await existingSchedule.save();
    return existingSchedule;
  }

  // If no existing schedule, create a new one
  const newSchedule = await DoctorSchedule.create({
    doctor: new Types.ObjectId(doctorId),
    date: new Date(date.split('-').reverse().join('-')),
    slots,
  });

  return newSchedule;
};

const getDoctorSchedules = async (doctorId: string) => {
  return await DoctorSchedule.find({ doctor: doctorId }).lean();
};

const getAvailableSlots = async (doctorId: string, date: string) => {
  const schedule = await DoctorSchedule.findOne({
    doctor: doctorId,
    date: new Date(date.split('-').reverse().join('-')),
  }).lean();
  if (!schedule) return null;

  return {
    schedule: schedule._id,
    date: schedule.date.toISOString(),
    slots: schedule.slots.filter(slot => !slot.isBooked),
  };
};

export const DoctorScheduleService = {
  createDoctorSchedule,
  getDoctorSchedules,
  getAvailableSlots,
};
