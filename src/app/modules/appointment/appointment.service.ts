import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { Appointment } from "./appointment.model";
import { DoctorSchedule } from "../doctorSchedule/doctorSchedule.model";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { Doctor } from "../doctor/doctor.model";
import admin, { app } from "firebase-admin";
import { NotificationService } from "../notification/notification.service";
import cacheService from "../../../util/cacheService";

const bookAppointment = async (req: any) => {
  const appointmentData = JSON.parse(req.body.data); // Parse JSON data from form-data

  const schedule = await DoctorSchedule.findById(appointmentData.schedule);
  if (!schedule) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Schedule not found");
  }
  const {
    doctor: doctorId,
    user: userId,
    slot: { startTime, endTime },
    patientDetails: { fullName, gender, age, problemDescription },
  } = appointmentData;
  const user = await User.findById(userId).lean().exec();
  const doctor = await Doctor.findById(doctorId).lean().exec();
  const fcmToken = doctor?.fcmToken;
  const isDoctorScheduled = await DoctorSchedule.findOne({
    doctor: doctorId,
    _id: schedule._id,
  });
  console.log({
    doctor: doctorId,
    _id: schedule._id,
  });
  if (!isDoctorScheduled) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor not scheduled");
  }
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found");
  }
  const slotIndex = schedule.slots.findIndex(
    slot => slot.startTime === startTime && slot.endTime === endTime,
  );
  if (slotIndex === -1) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Slot not found");
  }
  if (schedule.slots[slotIndex].isBooked) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Slot already booked");
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
        (file: Express.Multer.File) => `/images/${file.filename}`,
      );
    }
    if (req.files.doc) {
      attachmentPdfs = req.files.doc.map(
        (file: Express.Multer.File) => `/docs/${file.filename}`,
      );
    }
  }

  // const order= OrderModel.findById(appointmentData.orderId);
  // if(!order){
  //   throw new AppError(StatusCodes.BAD_REQUEST, 'Order not found');
  // }

  const appointment = await Appointment.create({
    doctor: doctorId,
    user: userId,
    schedule: schedule._id,
    slot: { startTime, endTime },
    patientDetails: { fullName, gender, age, problemDescription },
    attachmentImage: attachmentImages,
    attachmentPdf: attachmentPdfs,
    status: "Upcoming",
  });

  // await OrderService.updateOrder(appointmentData.orderId,{appointmentId:appointment
  // ._id});

  if (appointment && fcmToken) {
    const message = {
      token: fcmToken, // Device FCM Token
      notification: {
        title: "New Appointment", // Title of the notification
        body: `You have an appointment with ${user.name} at ${startTime}`, // Message
      },
      data: {
        extraData: `You have an appointment with ${user.name} at ${startTime}`,
      },
    };
    await admin.messaging().send(message);
    await NotificationService.createNotification({
      body: `You have an appointment with ${user.name} at ${startTime}`,
      user: doctorId,
    });
  }
  return appointment;
};
const getUserAppointments = async (userId: string) => {
  const appointments = await Appointment.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },

    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    { $unwind: "$doctorDetails" },
    {
      $lookup: {
        from: "doctorschedules",
        localField: "schedule",
        foreignField: "_id",
        as: "scheduleDetails",
      },
    },
    { $unwind: "$scheduleDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "doctorDetails.specialist",
        foreignField: "_id",
        as: "specialistDetails",
      },
    },
    { $unwind: "$specialistDetails" },
    {
      $sort: { "scheduleDetails.date": -1 },
    },
    {
      $project: {
        _id: 1,
        name: "$doctorDetails.name",
        image: "$doctorDetails.image",
        specialist: "$specialistDetails.name",
        date: "$scheduleDetails.date",
        startTime: "$slot.startTime",
        endTime: "$slot.endTime",
        accountID: "$doctorDetails._id",
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
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    { $unwind: "$doctorDetails" },
    {
      $lookup: {
        from: "doctorschedules",
        localField: "schedule",
        foreignField: "_id",
        as: "scheduleDetails",
      },
    },
    { $unwind: "$scheduleDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "doctorDetails.specialist",
        foreignField: "_id",
        as: "specialistDetails",
      },
    },
    { $unwind: "$specialistDetails" },
    {
      $project: {
        _id: 1,
        doctor: {
          _id: "$doctorDetails._id",
          name: "$doctorDetails.name",
          image: "$doctorDetails.image",
          country: "$doctorDetails.country",
          aboutDoctor: "$doctorDetails.aboutDoctor",
          clinic: "$doctorDetails.clinic",
          clinicAddress: "$doctorDetails.clinicAddress",
          experience: "$doctorDetails.experience",
          specialist: "$specialistDetails.name",
          consultationFee: "$doctorDetails.consultationFee",
        },
        date: "$scheduleDetails.date",
        startTime: "$slot.startTime",
        endTime: "$slot.endTime",
        user: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          country: "$userDetails.country",
          phoneNumber: "$userDetails.phoneNumber",
          image: "$userDetails.image",
        },
        prescription: 1,
        doctorNote: 1,
        patientDetails: 1,
        attachmentImage: 1,
        attachmentPdf: 1,
        review: 1,
        status: 1,
        isNoteHidden: 1,
      },
    },
  ]);
  const appointment = appointments[0];
  if (!appointment.review) {
    appointment.review = null;
  }
  return appointment;
};
const reviewAppointment = async (id: string, userId: string, payload: any) => {
  console.log(id, userId, payload);
  const isValidUserForReview = await Appointment.findOne({
    _id: id,
    user: userId,
  });
  const userData = await User.findById(userId);
  if (!userData) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found");
  }
  if (!isValidUserForReview) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You are not allowed to review this appointment",
    );
  }
  const appointment = (await Appointment.findByIdAndUpdate(
    id,
    { review: { ...payload, createdAt: new Date() } },
    { new: true },
  )) as any;

  if (!appointment) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Appointment not found");
  }
  const avgRating = await Appointment.aggregate([
    {
      $match: { doctor: appointment.doctor },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$review.rating" },
      },
    },
  ]);

  const newAvgRating = avgRating[0]?.avgRating
    ? parseFloat(avgRating[0].avgRating.toFixed(1))
    : 0;

  const doctor = await Doctor.findByIdAndUpdate(
    appointment.doctor,
    {
      avgRating: newAvgRating,
    },
    { new: true },
  );

  if (doctor && doctor.fcmToken) {
    const message = {
      token: doctor.fcmToken, // Device FCM Token
      notification: {
        title: "New Review", // Title of the notification
        body: `You got ${payload.rating} stars from ${userData.name}`, // Message
      },
      data: {
        extraData: `You got ${payload.rating} stars from ${userData.name}`,
      },
    };
    await admin.messaging().send(message);
  }

  // Cache the updated doctor profile for 24 hours
  await cacheService.deleteCache(`doctorProfile_${id.toString()}`);
  await cacheService.deleteCache(`singleDoctor_${id.toString()}`);

  return appointment;
};
const getAllUserPrescriptions = async (userId: string) => {
  const appointments = await Appointment.aggregate([
    {
      $match: {
        user: new Types.ObjectId(userId),
        prescription: { $exists: true, $ne: null },
      },
    },
    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    { $unwind: "$doctorDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "doctorDetails.specialist",
        foreignField: "_id",
        as: "specialistDetails",
      },
    },
    { $unwind: "$specialistDetails" },
    {
      $project: {
        _id: 1,
        name: "$doctorDetails.name",
        image: "$doctorDetails.image",
        specialist: "$specialistDetails.name",
        avgRating: "$doctorDetails.avgRating",
        consultationFee: "$doctorDetails.consultationFee",
        date: 1,
        startTime: "$slot.startTime",
        endTime: "$slot.endTime",
        status: 1,
        prescription: 1,
        doctorNote: {
          $cond: [{ $eq: ["$isNoteHidden", true] }, "$$REMOVE", "$doctorNote"],
        },
        isNoteHidden: 1,
      },
    },
  ]);

  return appointments;
};
const addNoteToAppointment = async (appointmentId: string, payload: any) => {
  const validFields = ["note", "isNoteHidden"];
  const isValidField = Object.keys(payload).every(field =>
    validFields.includes(field),
  );
  if (!isValidField) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid field");
  }
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { doctorNote: payload.note, ...payload },
    { new: true, upsert: true },
  );

  return appointment;
};
const toggleIsNoteHidden = async (appointmentId: string) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Appointment not found");
  }
  appointment.isNoteHidden = !appointment.isNoteHidden;
  await appointment.save();
  return appointment;
};
const addPrescriptionToAppointment = async (
  appointmentId: string,
  req: any,
) => {
  let attachmentPdf;

  if (req.files.doc) {
    attachmentPdf = `/docs/${req.files.doc[0].filename}`;
  }

  console.log(attachmentPdf);
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { prescription: attachmentPdf },
    { new: true, upsert: true },
  );

  const [user, doctor] = await Promise.all([
    User.findById(appointment.user),
    Doctor.findById(appointment.doctor),
  ]);
  if (user && doctor && user.fcmToken) {
    const message = {
      token: user.fcmToken, // Device FCM Token
      notification: {
        title: "New Prescription", // Title of the notification
        body: `You have a new prescription from ${doctor.name}`, // Message
      },
      data: {
        extraData: `You have a new prescription from ${doctor.name}`,
      },
    };
    await admin.messaging().send(message);
    await NotificationService.createNotification({
      body: `You have a new prescription from ${doctor.name}`, // Message
      user: appointment.user.toString(),
    });
  }
  return appointment;
};
const appointmentStatusUpdate = async (
  appointmentId: string,
  status: string,
) => {
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status },
    { new: true },
  );
  return appointment;
};
const doctorAppointments = async (doctorId: string, status: string) => {
  if (!doctorId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor Id is required");
  }

  let queries: any[] = [{ doctor: new Types.ObjectId(doctorId) }];
  if (status) {
    queries.push({ status: status });
  }
  const appointments = await Appointment.aggregate([
    { $match: { $and: queries } },
    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    { $unwind: "$doctorDetails" },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $lookup: {
        from: "doctorschedules",
        localField: "schedule",
        foreignField: "_id",
        as: "scheduleDetails",
      },
    },
    { $unwind: "$scheduleDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "doctorDetails.specialist",
        foreignField: "_id",
        as: "specialistDetails",
      },
    },
    { $unwind: "$specialistDetails" },
    {
      $project: {
        _id: 1,
        name: "$userDetails.name",
        image: "$userDetails.image",
        specialist: "$specialistDetails.name",
        accountID: "$userDetails._id",
        date: "$scheduleDetails.date",
        startTime: "$slot.startTime",
        endTime: "$slot.endTime",
        status: 1,
      },
    },
  ]);

  return appointments;
};
const doctorAppointmentCounts = async (doctorId: string) => {
  const upcoming = await Appointment.countDocuments({
    doctor: doctorId,
    status: "Upcoming",
  });
  const completed = await Appointment.countDocuments({
    doctor: doctorId,
    status: "Completed",
  });
  const cancelled = await Appointment.countDocuments({
    doctor: doctorId,
    status: "Cancelled",
  });

  return {
    upcoming,
    completed,
    cancelled,
    total: upcoming + completed + cancelled,
  };
};
const getAllAppointments = async (
  searchParams: {
    date?: string;
    name?: string;
  },
  page: number = 1,
  limit: number = 9999999999999,
) => {
  const { date, name } = searchParams;
  const matchConditions: any = {};
  if (date) {
    const [day, month, year] = date.split("-");
    const formattedDate = new Date(`${year}-${month}-${day}`);
    matchConditions["scheduleDetails.date"] = formattedDate;
  }

  if (name) {
    matchConditions["$or"] = [
      { "userDetails.name": { $regex: name, $options: "i" } },
      { "doctorDetails.name": { $regex: name, $options: "i" } },
    ];
  }

  const appointments = await Appointment.aggregate([
    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    { $unwind: "$doctorDetails" },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $lookup: {
        from: "doctorschedules",
        localField: "schedule",
        foreignField: "_id",
        as: "scheduleDetails",
      },
    },
    { $unwind: "$scheduleDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "doctorDetails.specialist",
        foreignField: "_id",
        as: "specialistDetails",
      },
    },
    { $unwind: "$specialistDetails" },
    { $match: matchConditions },
    {
      $project: {
        _id: 1,
        doctor: {
          name: "$doctorDetails.name",
          image: "$doctorDetails.image",
          country: "$doctorDetails.country",
          aboutDoctor: "$doctorDetails.aboutDoctor",
          clinic: "$doctorDetails.clinic",
          clinicAddress: "$doctorDetails.clinicAddress",
          experience: "$doctorDetails.experience",
          specialist: "$specialistDetails.name",
          consultationFee: "$doctorDetails.consultationFee",
        },
        date: "$scheduleDetails.date",
        startTime: "$slot.startTime",
        endTime: "$slot.endTime",
        user: {
          name: "$userDetails.name",
          country: "$userDetails.country",
          phoneNumber: "$userDetails.phoneNumber",
          image: "$userDetails.image",
        },
        prescription: 1,
        doctorNote: 1,
        patientDetails: 1,
        attachmentImage: 1,
        attachmentPdf: 1,
        review: 1,
        status: 1,
        isNoteHidden: 1,
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  return appointments;
};

const addNoteWithDoctors = async (appointmentId: string, payload: string[]) => {
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { noteForDoctors: payload },
    { new: true, upsert: true },
  );

  return appointment;
};
const meOnNotesMention = async (doctorId: string) => {
  const appointments = await Appointment.find({
    noteForDoctors: { $in: [doctorId] },
  }).select("prescription doctorNote patientDetails doctor status");

  return appointments;
};

export const AppointmentServices = {
  bookAppointment,
  getUserAppointments,
  getAppointmentDetails,
  reviewAppointment,
  getAllUserPrescriptions,
  addNoteToAppointment,
  toggleIsNoteHidden,
  addPrescriptionToAppointment,
  appointmentStatusUpdate,
  doctorAppointments,
  doctorAppointmentCounts,
  getAllAppointments,
  addNoteWithDoctors,
  meOnNotesMention,
};
