import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AppointmentServices } from './appointment.service';

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentServices.bookAppointment(req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Appointment booked successfully',
    data: result,
  });
});

const getUserAppointments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await AppointmentServices.getUserAppointments(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User appointments fetched successfully',
    data: result,
  });
});

const getAppointmentDetails = catchAsync(
  async (req: Request, res: Response) => {
    const appointmentId = req.params.id;

    const result = await AppointmentServices.getAppointmentDetails(
      appointmentId
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Appointment fetched successfully',
      data: result,
    });
  }
);

const reviewAppointment = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const appointmentId = req.params.id;
  const payload = req.body;
  console.log(req.user.id, req.body);
  const result = await AppointmentServices.reviewAppointment(
    appointmentId,
    req.user.id,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Appointment reviewed successfully',
    data: result,
  });
});

const getAllUserPrescriptions = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const result = await AppointmentServices.getAllUserPrescriptions(userId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User prescriptions fetched successfully',
      data: result,
    });
  }
);

const addNoteToAppointment = catchAsync(async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const payload = req.body;
  const result = await AppointmentServices.addNoteToAppointment(
    appointmentId,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Note added to appointment successfully',
    data: result,
  });
});

const toggleIsNoteHidden = catchAsync(async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const result = await AppointmentServices.toggleIsNoteHidden(appointmentId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Note visibility toggled successfully',
    data: result,
  });
});

const addPrescriptionToAppointment = catchAsync(
  async (req: Request, res: Response) => {
    const appointmentId = req.params.id;

    const result = await AppointmentServices.addPrescriptionToAppointment(
      appointmentId,
      req
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Prescription added to appointment successfully',
      data: result,
    });
  }
);

const appointmentStatusUpdate = catchAsync(
  async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const status = req.body.status;

    const result = await AppointmentServices.appointmentStatusUpdate(
      appointmentId,
      status
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Appointment status updated successfully',
      data: result,
    });
  }
);
const doctorAppointments = catchAsync(async (req: Request, res: Response) => {
  const status = req.query.status as string;
  const result = await AppointmentServices.doctorAppointments(
    req.params.doctorId,
    status
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Doctors appointments fetched successfully',
    data: result,
  });
});

const doctorAppointmentCounts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AppointmentServices.doctorAppointmentCounts(
      req.params.doctorId
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Doctors appointments count fetched successfully',
      data: result,
    });
  }
);

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentServices.getAllAppointments(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All appointments fetched successfully',
    data: result,
  });
});
const addNoteWithDoctors = catchAsync(async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const payload = req.body;
  const result = await AppointmentServices.addNoteWithDoctors(
    appointmentId,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Note added to appointment successfully',
    data: result,
  });
});
const meOnNotesMention = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentServices.meOnNotesMention(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Notes fetched successfully',
    data: result,
  });
});

export const AppointmentControllers = {
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
  meOnNotesMention,
  addNoteWithDoctors
};
