import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { MedicalRecordModel } from './medicalRecord.model';
import { QueryBuilder } from '../../builder/QueryBuilder';

const createMedicalRecord = async (payload: any, req: any) => {
  let prescription;
  if (req.files.doc) {
    prescription = `/docs/${req.files.doc[0].filename}`;
  } else {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Prescription is required');
  }

  const parsedJSON = JSON.parse(payload);
  const result = await MedicalRecordModel.create({
    ...parsedJSON,
    prescription,
  });
  return result;
};

const getAllMedicalRecords = async (query: Record<string, unknown>) => {
  const medicalRecordQuery = new QueryBuilder(MedicalRecordModel.find(), query)
    .search(['name', 'medicalHistory'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await medicalRecordQuery.countTotal();
  const result = await medicalRecordQuery.modelQuery;
  return { result, meta };
};
const getMedicalRecordById = async (id: string) => {
  const medicalRecord = await MedicalRecordModel.findById(id);
  if (!medicalRecord) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Medical record not found!');
  }
  return medicalRecord;
};
const updateMedicalRecord = async (
  id: string,
  payload: {
    name?: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
    medicalHistory?: string;
    user?: string;
    prescription?: string;
  },
  req: any
) => {
  const medicalRecord = await MedicalRecordModel.findById(id);
  if (!medicalRecord) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Medical record not found!');
  }

  let prescription;
  if (req.files.doc) {
    prescription = `/docs/${req.files.doc[0].filename}`;
    payload.prescription = prescription;
  }

  const updatedMedicalRecord = await MedicalRecordModel.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
    }
  );
  return updatedMedicalRecord;
};

const deleteMedicalRecord = async (id: string) => {
  const medicalRecord = await MedicalRecordModel.findById(id);
  if (!medicalRecord) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Medical record not found!');
  }
  await MedicalRecordModel.findByIdAndDelete(id);
  return medicalRecord;
};

export const MedicalRecordService = {
  createMedicalRecord,
  getAllMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordById,
};
