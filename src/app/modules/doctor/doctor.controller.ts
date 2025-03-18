import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DoctorService } from './doctor.service';
import { JwtPayload } from 'jsonwebtoken';

const createDoctorToDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const { ...doctorData } = req.body;
    const doctor = await DoctorService.createDoctorToDB(doctorData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Doctor created successfully',
      data: doctor,
    });
  }
);

const loginDoctor = catchAsync(async (req: Request, res: Response) => {
  const { uniqueId, password,fcmToken } = req.body;
  const doctor = await DoctorService.loginDoctor({ uniqueId, password ,fcmToken});

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Doctor logged in successfully',
    data: doctor,
  });
});

const getDoctorProfile = catchAsync(async (req: Request, res: Response) => {
  const doctor = req.user as JwtPayload;
  const result = await DoctorService.getDoctorProfileFromDB(doctor);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

const updateDoctorProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctor = req.user as JwtPayload; 
    let image;
    let professionalIdFront;
    let professionalIdBack;
    let medicalLicense;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      image = `/images/${req.files.image[0].filename}`;
    }
    if (
      req.files &&
      'professionalIdFront' in req.files &&
      req.files.professionalIdFront[0]
    ) {
      professionalIdFront = `/images/${req.files.professionalIdFront[0].filename}`;
    }
    if (
      req.files &&
      'professionalIdBack' in req.files &&
      req.files.professionalIdBack[0]
    ) {
      professionalIdBack = `/images/${req.files.professionalIdBack[0].filename}`;
    }
    if (
      req.files &&
      'medicalLicense' in req.files &&
      req.files.medicalLicense[0]
    ) {
      medicalLicense = `/docs/${req.files.medicalLicense[0].filename}`;
    }

    const doctorData = JSON.parse(req.body.data);

    const data = {
      image,
      professionalIdFront,
      professionalIdBack,
      medicalLicense,
      ...doctorData,
    };
    const result = await DoctorService.updateDoctorProfileToDB(doctor, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  console.log(req.query);
  if (!(req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
    req.query.approvedStatus = 'approved' as any;
  }

  const result = await DoctorService.getAllDoctors(req.query,req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All doctors retrieved successfully',
    data: result.result,
    pagination: result.meta,
  });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getSingleDoctor(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Doctor retrieved successfully',
    data: result,
  });
});
const updateDoctorApprovedStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DoctorService.updateDoctorApprovedStatus(
      req.params.id,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Doctor approved successfully',
      data: result,
    });
  }
);
const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.deleteDoctor(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Doctor deleted successfully',
    data: result,
  });
});

export const DoctorController = {
  createDoctorToDB,
  getDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getSingleDoctor,
  loginDoctor,
  updateDoctorApprovedStatus,
  deleteDoctor,
};
