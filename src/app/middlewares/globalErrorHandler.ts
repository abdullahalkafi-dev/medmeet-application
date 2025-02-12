// import { ErrorRequestHandler } from 'express';
// import config from '../../config';
// import AppError from '../../errors/AppError';
// import handleValidationError from '../../errors/handleValidationError';
// import handleZodError from '../../errors/handleZodError';
// import { errorLogger } from '../../shared/logger';
// import { IErrorMessage } from '../../types/errors.types';
// import { StatusCodes } from 'http-status-codes';

// const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
//   console.log(`come to globalErrorHandler
    
//     error ${error.name}
//     `);
//   config.node_env === 'development'
//     ? console.log('🚨 globalErrorHandler ~~ ', error)
//     : errorLogger.error('🚨 globalErrorHandler ~~ ', error);

//   let statusCode = 500;
//   let message = 'Something went wrong';
//   let errorMessages: IErrorMessage[] = [];

//   if (error.name === 'ZodError') {
//     const simplifiedError = handleZodError(error);
//     statusCode = simplifiedError.statusCode;
//     message = simplifiedError.message;
//     errorMessages = simplifiedError.errorMessages;
//   } else if (error.name === 'ValidationError') {
//     const simplifiedError = handleValidationError(error);
//     statusCode = simplifiedError.statusCode;
//     message = simplifiedError.message;
//     errorMessages = simplifiedError.errorMessages;
//   } else if (error.name === 'JsonWebTokenError') {
//     statusCode = StatusCodes.UNAUTHORIZED;
//     message = 'Invalid token, please login again';
//     errorMessages = error.message
//       ? [
//           {
//             path: '',
//             message: error.message,
//           },
//         ]
//       : [];
//   } else if (error.name === 'TokenExpiredError') {
//     statusCode = StatusCodes.UNAUTHORIZED;
//     message = 'Invalid token, please login again';
//     errorMessages = error.message
//       ? [
//           {
//             path: '',
//             message: error.message,
//           },
//         ]
//       : [];
//   } else if (error.name === 'SyntaxError') {
//     statusCode = StatusCodes.UNAUTHORIZED;
//     message = 'Invalid JSON, please valid JSON';
//     errorMessages = error.message
//       ? [
//           {
//             path: '',
//             message: error.message,
//           },
//         ]
//       : [];
//   } else if (error instanceof AppError) {
//     statusCode = error.statusCode;
//     message = error.message;
//     errorMessages = error.message
//       ? [
//           {
//             path: '',
//             message: error.message,
//             data: error.data,
//           },
//         ]
//       : [];
//   } else if (error instanceof Error) {
//     message = error.message;
//     errorMessages = error.message
//       ? [
//           {
//             path: '',
//             message: error?.message,
//           },
//         ]
//       : [];
//   }
//       console.log({
//         success: false,
//         message,
//         errorMessages,
//         stack: config.node_env !== 'production' ? error?.stack : undefined,
//       });
//   res.status(statusCode).json({
//     success: false,
//     message,
//     errorMessages,
//     stack: config.node_env !== 'production' ? error?.stack : undefined,
//   });
// };

// export default globalErrorHandler;



import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "../errors/AppError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleValidationError from "../errors/handleValidationError";
import handleZodError from "../errors/handleZodError";

import config from "../../config";
import { TErrorSources } from "../../types/error";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "ValidationError") {
    console.log(err);
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.node_env === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;


