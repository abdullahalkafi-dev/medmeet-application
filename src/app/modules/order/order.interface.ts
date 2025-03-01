import { Types } from "mongoose";

export type TOrder = {
    _id: string;
    appointmentId: Types.ObjectId;
    [key: string]: any; // Allows for additional dynamic fields
}
