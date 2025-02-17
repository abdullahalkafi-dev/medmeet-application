import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const doctorVerifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { ...verifyData } = req.body;
  console.log(verifyData);
  const result = await AuthService.doctorVerifyEmailToDB(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result.data,
  });
});

const userVerifyEmailToDB = catchAsync(async (req: Request, res: Response) => {
  const { ...verifyData } = req.body;

  const result = await AuthService.userVerifyEmailToDB(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result.data,
  });
});

const doctorForgetPasswordToDB = catchAsync(
  async (req: Request, res: Response) => {
    const email = req.body.uniqueId;

    const result = await AuthService.doctorForgetPasswordToDB(email);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Please check your email, we sent an OTP!',
      data: result,
    });
  }
);

const userForgetPasswordToDB = catchAsync(
  async (req: Request, res: Response) => {
    const uniqueId = req.body.uniqueId;
    const result = await AuthService.userForgetPasswordToDB(uniqueId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Please check your email, we sent an OTP!',
      data: result,
    });
  }
);

const doctorResetPasswordToDB = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { ...resetData } = req.body;
    const result = await AuthService.doctorResetPasswordToDB(token!, resetData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Password reset successfully',
      data: result,
    });
  }
);

const userResetPasswordToDB = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    console.log(token);
    const { ...resetData } = req.body;
    const result = await AuthService.userResetPasswordToDB(token!, resetData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Password reset successfully',
      data: result,
    });
  }
);

const doctorChangePasswordToDB = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { ...passwordData } = req.body;
    await AuthService.doctorChangePasswordToDB(user, passwordData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Password changed successfully',
    });
  }
);

const userChangePasswordToDB = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { ...passwordData } = req.body;
    await AuthService.userChangePasswordToDB(user, passwordData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Password changed successfully',
    });
  }
);

const userNewAccessTokenToUser = catchAsync(
  async (req: Request, res: Response) => {
    const { token } = req.body;
    const result = await AuthService.userNewAccessTokenToUser(token);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Access token generated successfully',
      data: result,
    });
  }
);

const newAccessTokenToUser = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await AuthService.newAccessTokenToUser(token);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Access token generated successfully',
    data: result,
  });
});
export const AuthController = {
  doctorVerifyEmail,
  userVerifyEmailToDB,
  doctorForgetPasswordToDB,
  userForgetPasswordToDB,
  doctorResetPasswordToDB,
  userResetPasswordToDB,
  doctorChangePasswordToDB,
  userChangePasswordToDB,
  userNewAccessTokenToUser,
  newAccessTokenToUser,
};
