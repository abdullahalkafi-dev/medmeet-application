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

export const AppointmentControllers = {
  bookAppointment,
  getUserAppointments,
  getAppointmentDetails,
  reviewAppointment,
};
