import express from "express";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorController } from "./doctor.controller";
import { DoctorValidation } from "./doctor.validation";
import { AuthValidation } from "../auth/auth.validation";
import { AuthController } from "../auth/auth.controller";

const router = express.Router();
router.post(
  "/",
  validateRequest(DoctorValidation.createDoctorZodSchema),
  DoctorController.createDoctorToDB,
);
//auth for doctor
router.post(
  "/login",
  validateRequest(DoctorValidation.loginZodSchema),
  DoctorController.loginDoctor,
);
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.createForgetPasswordZodSchema),
  AuthController.doctorForgetPasswordToDB,
);
router.post(
  "/verify-email",
  validateRequest(AuthValidation.createVerifyEmailZodSchema),
  AuthController.doctorVerifyEmail,
);
router.post("/doctor-resend-otp", AuthController.doctorResendOtp);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.createResetPasswordZodSchema),
  AuthController.doctorResetPasswordToDB,
);
router.post(
  "/change-password",
  auth(USER_ROLES.ADMIN, USER_ROLES.DOCTOR),
  validateRequest(AuthValidation.createChangePasswordZodSchema),
  AuthController.doctorChangePasswordToDB,
);
router.get(
  "/profile",
  auth(USER_ROLES.DOCTOR),
  DoctorController.getDoctorProfile,
);
router.post(
  "/update-profile",
  auth(USER_ROLES.DOCTOR),
  fileUploadHandler,
  validateRequest(DoctorValidation.updateDoctorZodSchema),
  DoctorController.updateDoctorProfile,
);
router.post(
  "/approve-doctor/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  DoctorController.updateDoctorApprovedStatus,
);
router.get(
  "/",
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.DOCTOR,
    USER_ROLES.USER,
  ),
  DoctorController.getAllDoctors,
);

router.get(
  "/:id",
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.DOCTOR,
    USER_ROLES.USER,
  ),
  DoctorController.getSingleDoctor,
);
router.delete(
  "/:id",
  auth(USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  DoctorController.deleteDoctor,
);
export const DoctorRoutes = router;
