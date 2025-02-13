import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';

import { TSetting } from './setting.interface';
import { Setting } from './setting.model';

const createSetting = async (payload: Partial<TSetting>) => {
  const isExistSetting = await Setting.findOne();
  if (isExistSetting) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Setting already exist!');
  }
  const setting = await Setting.create(payload);
  return setting;
};

const getSettings = async () => {
  const settings = await Setting.findOne({});
  return settings;
};

const updateSetting = async (payload: Partial<TSetting>) => {
  const setting = await Setting.findOne();
  if (!setting) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Setting not found!');
  }
  const updatedSetting = await Setting.findOneAndUpdate({}, payload, {
    new: true,
  });
  return updatedSetting;
};

export const SettingService = {
  createSetting,
  updateSetting,
  getSettings,
};
