import { StatusCodes } from 'http-status-codes';
import { get, Types } from 'mongoose';
import { Appointment } from './appointment.model';
import { DoctorSchedule } from '../doctorSchedule/doctorSchedule.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';

const bookAppointment = async (req: any) => {
  const appointmentData = JSON.parse(req.body.data); // Parse JSON data from form-data

  const schedule = await DoctorSchedule.findById(appointmentData.schedule);
  if (!schedule) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Schedule not found');
  }
  const {
    doctor: doctorId,
    user: userId,
    slot: { startTime, endTime },
    patientDetails: { fullName, gender, age, problemDescription },
  } = appointmentData;

  const user = await User.findById(userId).lean().exec();

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  const slotIndex = schedule.slots.findIndex(
    slot => slot.startTime === startTime && slot.endTime === endTime
  );

  if (slotIndex === -1) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Slot not found');
  }

  if (schedule.slots[slotIndex].isBooked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Slot already booked');
  }

  schedule.slots[slotIndex].isBooked = true;
  schedule.slots[slotIndex].bookedBy = new Types.ObjectId(userId);
  await schedule.save();

  //   Handle file uploads
  let attachmentImages: string[] = [];
  let attachmentPdfs: string[] = [];
  console.log(req.files.image);

  if (req.files) {
    if (req.files.image) {
      attachmentImages = req.files.image.map(
        (file: Express.Multer.File) => `/images/${file.filename}`
      );
    }
    if (req.files.doc) {
      attachmentPdfs = req.files.doc.map(
        (file: Express.Multer.File) => `/docs/${file.filename}`
      );
    }
  }

  const appointment = await Appointment.create({
    doctor: doctorId,
    user: userId,
    schedule: schedule._id,
    slot: { startTime, endTime },
    patientDetails: { fullName, gender, age, problemDescription },
    attachmentImage: attachmentImages,
    attachmentPdf: attachmentPdfs,
    status: 'Upcoming',
  });

  return appointment;
};

const getUserAppointments = async (userId: string) => {
  const appointments = await Appointment.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },

    {
      $lookup: {
        from: 'doctors',
        localField: 'doctor',
        foreignField: '_id',
        as: 'doctorDetails',
      },
    },
    { $unwind: '$doctorDetails' },
    {
      $lookup: {
        from: 'doctorschedules',
        localField: 'schedule',
        foreignField: '_id',
        as: 'scheduleDetails',
      },
    },
    { $unwind: '$scheduleDetails' },
    {
      $lookup: {
        from: 'categories',
        localField: 'doctorDetails.specialist',
        foreignField: '_id',
        as: 'specialistDetails',
      },
    },
    { $unwind: '$specialistDetails' },
    {
      $project: {
        _id: 1,

        name: '$doctorDetails.name',
        image: '$doctorDetails.image',
        specialist: '$specialistDetails.name',

        date: '$scheduleDetails.date',

        startTime: '$slot.startTime',
        endTime: '$slot.endTime',
        status: 1,
      },
    },
  ]);

  return appointments;
};
const getAppointmentDetails = async (id: string) => {
  const appointments = await Appointment.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $lookup: {
        from: 'doctors',
        localField: 'doctor',
        foreignField: '_id',
        as: 'doctorDetails',
      },
    },
    { $unwind: '$doctorDetails' },
    {
      $lookup: {
        from: 'doctorschedules',
        localField: 'schedule',
        foreignField: '_id',
        as: 'scheduleDetails',
      },
    },
    { $unwind: '$scheduleDetails' },
    {
      $lookup: {
        from: 'categories',
        localField: 'doctorDetails.specialist',
        foreignField: '_id',
        as: 'specialistDetails',
      },
    },
    { $unwind: '$specialistDetails' },
    {
      $project: {
        _id: 1,
        doctor: {
          name: '$doctorDetails.name',
          image: '$doctorDetails.image',
          country: '$doctorDetails.country',
          aboutDoctor: '$doctorDetails.aboutDoctor',
          clinic: '$doctorDetails.clinic',
          clinicAddress: '$doctorDetails.clinicAddress',
          experience: '$doctorDetails.experience',
          specialist: '$specialistDetails.name',
          consultationFee: '$doctorDetails.consultationFee',
        },

        date: '$scheduleDetails.date',

        startTime: '$slot.startTime',
        endTime: '$slot.endTime',
        user: {
          name: '$userDetails.name',
          country: '$userDetails.country',
          phoneNumber: '$userDetails.phoneNumber',
          image: '$userDetails.image',
        },

        patientDetails: 1,
        attachmentImage: 1,
        attachmentPdf: 1,
        status: 1,
      },
    },
  ]);
  console.log(appointments);

  return appointments[0];
};

const reviewAppointment = async (id: string, userId: string, payload: any) => {
  console.log(id, userId, payload);
  const isValidUserForReview = await Appointment.findOne({
    _id: id,
    user: userId,
  });

  if (!isValidUserForReview) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You are not allowed to review this appointment'
    );
  }
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { review: { ...payload, createdAt: new Date() } },
    { new: true }
  );

  if (!appointment) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Appointment not found');
  }

  return appointment;
};

export const AppointmentServices = {
  bookAppointment,
  getUserAppointments,
  getAppointmentDetails,
  reviewAppointment,
};
