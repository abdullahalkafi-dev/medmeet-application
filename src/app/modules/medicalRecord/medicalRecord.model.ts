import { model, Schema, Types } from 'mongoose';
import { TMedicalRecord } from './medicalRecord.interface';


const medicalRecordSchema = new Schema<TMedicalRecord>(
    {
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
        },
        medicalHistory: {
            type: String,
            required: true,
        },
        prescription: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

export const MedicalRecordModel = model<TMedicalRecord>('MedicalRecord', medicalRecordSchema);