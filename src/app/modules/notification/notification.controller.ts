import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './notification.service';

const createNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.createNotification(req.body);

  sendResponse(res, {
    data: result,
    message: 'Notification created successfully',
    statusCode: 200,
    success: true,
  });
});

const getUserNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.getUserNotification(
    req.params.userId
  );

  sendResponse(res, {
    data: result,
    message: 'Notification retrieved successfully',
    statusCode: 200,
    success: true,
  });
});

export const NotificationController = {
  createNotification,
  getUserNotification,
};
