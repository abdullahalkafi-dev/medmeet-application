"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const fileUploadHandler = (req, res, next) => {
    // Create upload folder
    const baseUploadDir = path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(baseUploadDir)) {
        fs_1.default.mkdirSync(baseUploadDir);
    }
    // Folder create for different file
    const createDir = (dirPath) => {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath);
        }
    };
    // Create filename
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            let uploadDir;
            switch (file.fieldname) {
                case 'image':
                case 'professionalIdFront':
                case 'professionalIdBack':
                    uploadDir = path_1.default.join(baseUploadDir, 'images');
                    break;
                case 'media':
                    uploadDir = path_1.default.join(baseUploadDir, 'medias');
                    break;
                case 'doc':
                case 'medicalLicense':
                    uploadDir = path_1.default.join(baseUploadDir, 'docs');
                    break;
                default:
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'File is not supported');
            }
            createDir(uploadDir);
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            var _a;
            const fileExt = file.fieldname === 'medicalLicense' ||
                file.fieldname === 'doc' ||
                file.fieldname === 'docs'
                ? '.pdf'
                : '.png'; // Force .png for images and .pdf for certificates
            const date = new Date();
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            const randomCode = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
                let result = '';
                for (let i = 0; i < 5; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            };
            const originalNameWithoutExt = path_1.default.parse(file.originalname).name + '-' + randomCode();
            const fileName = ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) &&
                req.url === '/update-profile' &&
                file.fieldname == 'image'
                ? (req.user.id + originalNameWithoutExt)
                : originalNameWithoutExt.toLowerCase().split(' ').join('-') +
                    '-' +
                    formattedDate;
            cb(null, fileName + fileExt);
        },
    });
    // File filter
    const filterFilter = (req, file, cb) => {
        if (file.fieldname === 'image' ||
            file.fieldname === 'professionalIdFront' ||
            file.fieldname === 'professionalIdBack') {
            if (file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/heif' ||
                file.mimetype === 'image/heic' ||
                file.mimetype === 'image/tiff' ||
                file.mimetype === 'image/webp' ||
                file.mimetype === 'image/avif') {
                cb(null, true);
            }
            else {
                console.log(file.fieldname);
                console.log(file.mimetype);
                cb(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only .jpeg, .png, .jpg, .heif, .heic, .tiff, .webp, .avif files supported'));
            }
        }
        else if (file.fieldname === 'media') {
            if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only .mp4, .mp3, file supported'));
            }
        }
        else if (file.fieldname === 'doc' ||
            file.fieldname === 'medicalLicense') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only pdf supported'));
            }
        }
        else {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This file is not supported');
        }
    };
    // Return multer middleware
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: filterFilter,
    }).fields([
        { name: 'image', maxCount: 10 },
        { name: 'media', maxCount: 10 },
        { name: 'doc', maxCount: 10 },
        { name: 'professionalIdFront', maxCount: 10 },
        { name: 'professionalIdBack', maxCount: 10 },
        { name: 'medicalLicense', maxCount: 10 },
    ]);
    return upload(req, res, next);
};
exports.default = fileUploadHandler;
