import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import AppError from "../errors/AppError";
import sharp from "sharp";
const fileUploadHandler = (req: Request, res: Response, next: NextFunction) => {
  // Create upload folder
  const baseUploadDir = path.join(process.cwd(), "uploads");
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
      console.log(file.fieldname);
      switch (file.fieldname) {
        case "image":
        case "professionalIdFront":
        case "professionalIdBack":
          uploadDir = path.join(baseUploadDir, "images");
          break;
        case "media":
          uploadDir = path.join(baseUploadDir, "medias");
          break;
        case "doc":
        case "docs":
        case "medicalLicense":
          uploadDir = path.join(baseUploadDir, "docs");
          break;
        default:
          throw new AppError(StatusCodes.BAD_REQUEST, "File is not supported");
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      let fileExt: string;
      
      if (
        file.fieldname === "doc" ||
        file.fieldname === "docs" ||
        file.fieldname === "medicalLicense"
      ) {
        fileExt = ".pdf";
      } else if (
        file.fieldname === "image" ||
        file.fieldname === "professionalIdFront" ||
        file.fieldname === "professionalIdBack"
      ) {
        fileExt = ".tmp"; // will be converted to .webp later
      } else if (file.fieldname === "media") {
        // For media, retain the original extension
        fileExt = path.extname(file.originalname);
      } else {
        // Default case - retain original extension
        fileExt = path.extname(file.originalname);
      }
      
      const date = new Date();
      const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      const randomCode = () => {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
        let result = "";
        for (let i = 0; i < 5; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };
      const originalNameWithoutExt =
        path.parse(file.originalname).name + "-" + randomCode();
      const fileName =
        req?.user?.id &&
        req.url === "/update-profile" &&
        file.fieldname == "image"
          ? req.user.id + originalNameWithoutExt
          : originalNameWithoutExt.toLowerCase().split(" ").join("-") +
            "-" +
            formattedDate;

      cb(null, fileName + fileExt);
    },
  });

  // File filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (
      file.fieldname === "image" ||
      file.fieldname === "professionalIdFront" ||
      file.fieldname === "professionalIdBack"
    ) {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/heif" ||
        file.mimetype === "image/heic" ||
        file.mimetype === "image/tiff" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "image/avif"
      ) {
        cb(null, true);
      } else {
        console.log(file.fieldname);
        console.log(file.mimetype);
        cb(
          new AppError(
            StatusCodes.BAD_REQUEST,
            "Only .jpeg, .png, .jpg, .heif, .heic, .tiff, .webp, .avif files supported",
          ),
        );
      }
    } else if (file.fieldname === "media") {
      if (file.mimetype === "video/mp4" || file.mimetype === "audio/mpeg") {
        cb(null, true);
      } else {
        cb(
          new AppError(
            StatusCodes.BAD_REQUEST,
            "Only .mp4, .mp3, file supported",
          ),
        );
      }
    } else if (
      file.fieldname === "doc" ||
      file.fieldname === "docs" ||
      file.fieldname === "medicalLicense"
    ) {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new AppError(StatusCodes.BAD_REQUEST, "Only pdf supported"));
      }
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, "This file is not supported");
    }
  };

  // Return multer middleware
  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields([
    { name: "image", maxCount: 10 },
    { name: "media", maxCount: 10 },
    { name: "doc", maxCount: 10 },
    { name: "docs", maxCount: 10 },
    { name: "professionalIdFront", maxCount: 10 },
    { name: "professionalIdBack", maxCount: 10 },
    { name: "medicalLicense", maxCount: 10 },
  ]);
  // Execute the multer middleware
  upload(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    // Post-process image files: convert to WebP and compress.
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFields = ["image", "professionalIdFront", "professionalIdBack"];
      
      try {
        // Process each image field type
        for (const fieldName of imageFields) {
          if (fieldName in files) {
            const imageFiles = files[fieldName];
            
            // Loop through each image file uploaded for this field
            for (const file of imageFiles) {
              const inputFilePath = file.path;
              
              // Check if input file exists
              if (!fs.existsSync(inputFilePath)) {
                throw new Error(`Input file does not exist: ${inputFilePath}`);
              }
              
              // Create new filename by replacing .tmp with .webp
              const newFilePath = inputFilePath.replace(/\.tmp$/, ".webp");

              // Process the image with Sharp
              const sharpInstance = sharp(inputFilePath);
              await sharpInstance
                .resize({ width: 1024 })
                .webp({ quality: 40, effort: 6, nearLossless: false })
                .toFile(newFilePath);

              // Ensure Sharp releases the file handle
              sharpInstance.destroy();


              // Check if new file was created
              if (!fs.existsSync(newFilePath)) {
                throw new Error(`Output file was not created: ${newFilePath}`);
              }

              // Wait a bit to ensure file handles are released
              await new Promise(resolve => setTimeout(resolve, 100));

              // Try to remove the temporary file with retry logic
              let retryCount = 0;
              const maxRetries = 3;
              while (retryCount < maxRetries) {
                try {
                  fs.unlinkSync(inputFilePath);
                  break;
                } catch (unlinkError: any) {
                  retryCount++;
                  
                  if (retryCount === maxRetries) {
                    // If we can't delete the file after max retries, log warning but don't fail the entire process
                   
                  } else {
                    // Wait a bit before retrying
                    await new Promise(resolve => setTimeout(resolve, 200 * retryCount));
                  }
                }
              }

              // Update file metadata if needed for later middlewares
              file.path = newFilePath;
              file.filename = path.basename(newFilePath);
            }
          }
        }
      } catch (error) {
      
        return next(
          new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ),
        );
      }
    }

    next();
  });
};

export default fileUploadHandler;
