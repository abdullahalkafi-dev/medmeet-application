import { Types } from "mongoose";


export type TSlot = {
    startTime: string; // 'HH:mm'
    endTime: string; // 'HH:mm'
    isBooked: boolean;
    bookedBy?: Types.ObjectId; // Reference to User (optional)
  };
  
  export type TDoctorSchedule = Document & {
    doctor: Types.ObjectId;
    date: Date; // Use Date type for efficient querying
    slots: TSlot[];
  };
  