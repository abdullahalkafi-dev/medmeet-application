import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DoctorScheduleService } from './doctorSchedule.service';

const createDoctorSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schedule = await DoctorScheduleService.createDoctorSchedule(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Doctor schedule created successfully',
      data: schedule,
    });
  }
);

const getDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const schedules = await DoctorScheduleService.getDoctorSchedules(doctorId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Doctor schedules retrieved successfully',
    data: schedules,
  });
});

const getAvailableSlots = catchAsync(async (req: Request, res: Response) => {
  const { doctorId, date } = req.query;
  if (!doctorId || !date) {
throw new Error('Doctor ID and date are required');
  }
  const slots = await DoctorScheduleService.getAvailableSlots(
    doctorId as string,
    date as string
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Available slots retrieved successfully',
    data: slots,
  });
});

export const DoctorScheduleController = {
  createDoctorSchedule,
  getDoctorSchedules,
  getAvailableSlots,

};
