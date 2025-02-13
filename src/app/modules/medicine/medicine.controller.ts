import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MedicineService } from './medicine.service';

const createMedicine = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const medicine = await MedicineService.createMedicine(req.body);
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Medicine created successfully',
            data: medicine,
        });
    }
);

const getAllMedicines = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const medicines = await MedicineService.getAllMedicines(req.query);
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Medicines retrieved successfully',
            data: medicines.result,
            pagination: medicines.meta,
        });
    }
);
const updateMedicine = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const medicine = await MedicineService.updateMedicine(
            req.params.id,
            req.body
        );
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Medicine updated successfully',
            data: medicine,
        });
    }
);

const deleteMedicine = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const medicine = await MedicineService.deleteMedicine(req.params.id);
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Medicine deleted successfully',
            data: medicine,
        });
    }
);
   
export const MedicineController = {
    createMedicine,
    getAllMedicines,
    deleteMedicine,
    updateMedicine
};
