import { model, Schema } from 'mongoose';
import { TSetting } from './setting.interface';

const settingSchema = new Schema<TSetting>({
  privacyPolicy: {
    type: String,
    required: true,
    default: '',
  },
  termsAndConditions: {
    type: String,
    required: true,
    default: '',
  },
  aboutUs: {
    type: String,
    required: true,
    default: '',
  },
});

export const Setting = model<TSetting>('Setting', settingSchema);
