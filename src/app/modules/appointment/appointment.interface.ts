import { Types } from 'mongoose';

export type TPatientDetails = {
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  problemDescription: string;
};

export type TAppointment = {
  doctor: Types.ObjectId;
  user: Types.ObjectId;
  schedule: Types.ObjectId;
  slot: {
    startTime: string;
    endTime: string;
  };
  patientDetails: TPatientDetails;
  prescription?: string;
  doctorNote?: string;
  isNoteHidden?: boolean;
  attachmentImage?: string[];
  review: {
    rating: number;
    review: string;
    createdAt: Date;
  };
  attachmentPdf?: string[];
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};
