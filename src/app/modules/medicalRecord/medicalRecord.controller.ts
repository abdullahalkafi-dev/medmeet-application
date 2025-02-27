import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { MedicalRecordService } from './medicalRecord.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createMedicalRecord = catchAsync(async (req: Request, res: Response) => {
    const result = await MedicalRecordService.createMedicalRecord(req.body.data, req);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Medical record created successfully',
        data: result,
    });
});

const getAllMedicalRecords = catchAsync(async (req: Request, res: Response) => {
    const result = await MedicalRecordService.getAllMedicalRecords(req.query);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'All medical records retrieved successfully',
        data: result.result,
        pagination: result.meta,
    });
});

const getMedicalRecordById = catchAsync(async (req: Request, res: Response) => {
    const result = await MedicalRecordService.getMedicalRecordById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Medical record retrieved successfully',
        data: result,
    });
});

const updateMedicalRecord = catchAsync(async (req: Request, res: Response) => {
    const result = await MedicalRecordService.updateMedicalRecord(req.params.id, req.body, req);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Medical record updated successfully',
        data: result,
    });
});

const deleteMedicalRecord = catchAsync(async (req: Request, res: Response) => {
    const result = await MedicalRecordService.deleteMedicalRecord(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Medical record deleted successfully',
        data: result,
    });
});

export const MedicalRecordController = {
    createMedicalRecord,
    getAllMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord,
};