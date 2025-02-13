import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SettingService } from './setting.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createSetting = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const setting = await SettingService.createSetting(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Setting created successfully',
      data: setting,
    });
  }
);

const getSettings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const settings = await SettingService.getSettings();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Settings retrieved successfully',
      data: settings,
    });
  }
);

const updateSetting = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedSetting = await SettingService.updateSetting(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Setting updated successfully',
      data: updatedSetting,
    });
  }
);

export const SettingController = {
  createSetting,
  getSettings,
  updateSetting,
};
