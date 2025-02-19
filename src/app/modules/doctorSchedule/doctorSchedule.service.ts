import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { DoctorSchedule } from './doctorSchedule.model';
import { TSlot } from './doctorSchedule.interface';

// const createDoctorSchedule = async (payload: {
//   doctorId: string;
//   date: string;
//   slots: TSlot[];
// }) => {
//   const { doctorId, date, slots } = payload;

//   console.log(payload);

//   const existingSchedule = await DoctorSchedule.findOne({
//     doctor: doctorId,
//     date: new Date(date.split('-').reverse().join('-')),
//   });

//   if (existingSchedule) {
//     throw new AppError(
//       StatusCodes.BAD_REQUEST,
//       'Schedule for this date already exists'
//     );
//   }

//   const schedule = await DoctorSchedule.create({
//     doctor: new Types.ObjectId(doctorId),
//     date: new Date(date.split('-').reverse().join('-')),
//     slots,
//   });

//   return schedule;
// };

const createDoctorSchedule = async (payload: { doctorId: string; date: string; slots: TSlot[] }) => {
    const { doctorId, date, slots } = payload;
  
    // Find existing schedule for the doctor on the same date
    const existingSchedule = await DoctorSchedule.findOne({ doctor: doctorId, date: new Date(date.split('-').reverse().join('-')) });
  
    if (existingSchedule) {
      // Merge new slots with existing slots, ensuring no duplicate time slots
      const existingTimes = new Set(existingSchedule.slots.map(slot => slot.startTime));
      const newSlots = slots.filter(slot => !existingTimes.has(slot.startTime));
  
      if (existingSchedule.slots.length + newSlots.length > 48) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'A doctor can have a maximum of 48 slots per day');
      }
  
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
    date: new Date(date),
  }).lean();
  if (!schedule) return null;

  return schedule.slots.filter(slot => !slot.isBooked);
};

const bookAppointment = async (payload: {
  doctorId: string;
  date: string;
  slotIndex: number;
  userId: string;
}) => {
  const { doctorId, date, slotIndex, userId } = payload;
  const schedule = await DoctorSchedule.findOne({
    doctor: doctorId,
    date: new Date(date),
  });

  if (!schedule) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Schedule not found');
  }
  if (schedule.slots[slotIndex].isBooked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Slot already booked');
  }

  schedule.slots[slotIndex].isBooked = true;
  schedule.slots[slotIndex].bookedBy = new Types.ObjectId(userId);

  await schedule.save();
  return schedule;
};

const cancelAppointment = async (payload: {
  doctorId: string;
  date: string;
  slotIndex: number;
  userId: string;
}) => {
  const { doctorId, date, slotIndex, userId } = payload;
  const schedule = await DoctorSchedule.findOne({
    doctor: doctorId,
    date: new Date(date),
  });

  if (!schedule) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Schedule not found');
  }
  if (
    !schedule.slots[slotIndex].isBooked ||
    String(schedule.slots[slotIndex].bookedBy) !== userId
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You cannot cancel this appointment'
    );
  }

  schedule.slots[slotIndex].isBooked = false;
  schedule.slots[slotIndex].bookedBy = undefined;

  await schedule.save();
  return schedule;
};

export const DoctorScheduleService = {
  createDoctorSchedule,
  getDoctorSchedules,
  getAvailableSlots,
  bookAppointment,
  cancelAppointment,
};
