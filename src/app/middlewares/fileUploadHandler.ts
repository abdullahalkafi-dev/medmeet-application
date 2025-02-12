import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import AppError from '../errors/AppError';

const fileUploadHandler = (req: Request, res: Response, next: NextFunction) => {
  // Create upload folder
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  // Folder create for different file
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  // Create filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case 'image':
        case 'professionalIdFront':
        case 'professionalIdBack':
          uploadDir = path.join(baseUploadDir, 'images');
          break;
        case 'media':
          uploadDir = path.join(baseUploadDir, 'medias');
          break;
        case 'doc':
        case 'medicalLicense':
          uploadDir = path.join(baseUploadDir, 'docs');
          break;
        default:
          throw new AppError(StatusCodes.BAD_REQUEST, 'File is not supported');
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const fileExt = file.fieldname === 'medicalLicense' ? '.pdf' : '.png'; // Force .png for images and .pdf for certificates
      const date = new Date();
      const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      const randomCode = () => {
        const chars =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };
      const originalNameWithoutExt =
        path.parse(file.originalname).name + '-' + randomCode();
      const fileName =
        req?.user?.id &&
        req.url === '/update-profile' &&
        file.fieldname == 'image'
          ? req.user.id
          : originalNameWithoutExt.toLowerCase().split(' ').join('-') +
            '-' +
            formattedDate;

      cb(null, fileName + fileExt);
    },
  });

  // File filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (
      file.fieldname === 'image' ||
      file.fieldname === 'professionalIdFront' ||
      file.fieldname === 'professionalIdBack'
    ) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/heif' ||
        file.mimetype === 'image/heic' ||
        file.mimetype === 'image/tiff' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/avif'
      ) {
        cb(null, true);
      } else {
        cb(
          new AppError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg, .heif, .heic, .tiff, .webp, .avif files supported'
          )
        );
      }
    } else if (file.fieldname === 'media') {
      if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
        cb(null, true);
      } else {
        cb(
          new AppError(
            StatusCodes.BAD_REQUEST,
            'Only .mp4, .mp3, file supported'
          )
        );
      }
    } else if (
      file.fieldname === 'doc' ||
      file.fieldname === 'medicalLicense'
    ) {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new AppError(StatusCodes.BAD_REQUEST, 'Only pdf supported'));
      }
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, 'This file is not supported');
    }
  };

  // Return multer middleware
  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields([
    { name: 'image', maxCount: 3 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
    { name: 'professionalIdFront', maxCount: 3 },
    { name: 'professionalIdBack', maxCount: 3 },
    { name: 'medicalLicense', maxCount: 3 },
  ]);

  return upload(req, res, next);
};

export default fileUploadHandler;
