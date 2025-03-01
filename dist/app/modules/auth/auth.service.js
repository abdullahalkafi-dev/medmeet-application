"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const cryptoToken_1 = __importDefault(require("../../../util/cryptoToken"));
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const doctor_model_1 = require("../doctor/doctor.model");
const userResetToken_model_1 = require("../userResetToken/userResetToken.model");
const doctorResetToken_model_1 = require("../doctorResetToken/doctorResetToken.model");
const userForgetPasswordToDB = (uniqueId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(uniqueId);
    const isExistUser = yield user_model_1.User.findOne({ email: uniqueId });
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //send mail
    const otp = (0, generateOTP_1.default)();
    const value = {
        otp,
        email: isExistUser.email,
    };
    const forgetPassword = emailTemplate_1.emailTemplate.resetPassword(value);
    emailHelper_1.emailHelper.sendEmail(forgetPassword);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 600000),
    };
    console.log(authentication);
    console.log(value);
    yield user_model_1.User.findOneAndUpdate({ email: uniqueId }, { $set: { authentication } });
});
//doctor forget password
const doctorForgetPasswordToDB = (uniqueId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield doctor_model_1.Doctor.findOne({
        $or: [{ email: uniqueId }, { doctorId: uniqueId }],
    });
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Doctor doesn't exist!");
    }
    //send mail
    const otp = (0, generateOTP_1.default)();
    const value = {
        otp,
        email: isExistUser.email,
    };
    const forgetPassword = emailTemplate_1.emailTemplate.resetPassword(value);
    emailHelper_1.emailHelper.sendEmail(forgetPassword);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 6000000),
    };
    console.log(authentication);
    console.log(value);
    yield doctor_model_1.Doctor.findOneAndUpdate({ $or: [{ email: uniqueId }, { doctorId: uniqueId }] }, { $set: { authentication } });
});
//verify user email
const userVerifyEmailToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(payload);
    const { uniqueId, oneTimeCode } = payload;
    if (!uniqueId || !oneTimeCode) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide email and otp');
    }
    const isExistUser = yield user_model_1.User.findOne({ email: uniqueId }).select('+authentication');
    console.log(isExistUser);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (!oneTimeCode) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please give the otp, check your email we send a code');
    }
    console.log(oneTimeCode);
    if (((_a = isExistUser.authentication) === null || _a === void 0 ? void 0 : _a.oneTimeCode) !== oneTimeCode) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You provided wrong otp');
    }
    const date = new Date();
    if (date > ((_b = isExistUser.authentication) === null || _b === void 0 ? void 0 : _b.expireAt)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Otp already expired, Please try again');
    }
    let message;
    let data;
    yield user_model_1.User.findOneAndUpdate({ _id: isExistUser._id }, {
        authentication: {
            isResetPassword: true,
            oneTimeCode: null,
            expireAt: null,
        },
        verified: true,
    });
    //create token ;
    const createToken = (0, cryptoToken_1.default)();
    yield userResetToken_model_1.UserResetToken.create({
        user: isExistUser._id,
        token: createToken,
        expireAt: new Date(Date.now() + 5 * 600000),
    });
    message =
        'Verification Successful: Please securely store and utilize this code for reset password';
    data = createToken;
    return { data, message };
});
//resent otp
const userResendOtp = (uniqueId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findOne({ email: uniqueId });
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //send mail
    const otp = (0, generateOTP_1.default)();
    const value = {
        otp,
        email: isExistUser.email,
    };
    const verifyUserMail = emailTemplate_1.emailTemplate.createAccount(Object.assign(Object.assign({}, value), { name: isExistUser.name }));
    emailHelper_1.emailHelper.sendEmail(verifyUserMail);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 6000000),
    };
    console.log;
    yield user_model_1.User.findOneAndUpdate({ email: uniqueId }, { $set: { authentication } });
});
const doctorResendOtp = (uniqueId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield doctor_model_1.Doctor.findOne({
        $or: [{ email: uniqueId }, { doctorId: uniqueId }],
    });
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Doctor doesn't exist!");
    }
    //send mail
    const otp = (0, generateOTP_1.default)();
    const value = {
        otp,
        email: isExistUser.email,
    };
    const verifyDoctorMail = emailTemplate_1.emailTemplate.createAccount(Object.assign(Object.assign({}, value), { name: isExistUser.name }));
    emailHelper_1.emailHelper.sendEmail(verifyDoctorMail);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 6000000),
    };
    console.log;
    yield doctor_model_1.Doctor.findOneAndUpdate({ email: uniqueId }, { $set: { authentication } });
});
//verify doctor email
const doctorVerifyEmailToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(payload);
    const { uniqueId, oneTimeCode } = payload;
    const isExistUser = yield doctor_model_1.Doctor.findOne({
        $or: [{ email: uniqueId }, { doctorId: uniqueId }],
    }).select('+authentication');
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (!oneTimeCode) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please give the otp, check your email we send a code');
    }
    if (((_a = isExistUser.authentication) === null || _a === void 0 ? void 0 : _a.oneTimeCode) !== oneTimeCode) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You provided wrong otp');
    }
    const date = new Date();
    if (date > ((_b = isExistUser.authentication) === null || _b === void 0 ? void 0 : _b.expireAt)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Otp already expired, Please try again');
    }
    let message;
    let data;
    yield doctor_model_1.Doctor.findOneAndUpdate({ _id: isExistUser._id }, {
        authentication: {
            isResetPassword: true,
            oneTimeCode: null,
            expireAt: null,
        },
        verified: true,
    });
    //create token ;
    const createToken = (0, cryptoToken_1.default)();
    yield doctorResetToken_model_1.DoctorResetToken.create({
        user: isExistUser._id,
        token: createToken,
        expireAt: new Date(Date.now() + 5 * 60000),
    });
    message =
        'Verification Successful: Please securely store and utilize this code for reset password';
    data = createToken;
    return { data, message };
});
//forget password
const userResetPasswordToDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { newPassword, confirmPassword } = payload;
    //isExist token
    const isExistToken = yield userResetToken_model_1.UserResetToken.isExistToken(token);
    if (!isExistToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }
    //user permission check
    const isExistUser = yield user_model_1.User.findById(isExistToken.user).select('+authentication');
    if (!((_a = isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.authentication) === null || _a === void 0 ? void 0 : _a.isResetPassword)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You don't have permission to change the password. Please click again to 'Forgot Password'");
    }
    //validity check
    const isValid = yield userResetToken_model_1.UserResetToken.isExpireToken(token);
    if (!isValid) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token expired, Please click again to the forget password');
    }
    //check password
    if (newPassword !== confirmPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!");
    }
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
        authentication: {
            isResetPassword: false,
        },
    };
    yield user_model_1.User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
        new: true,
    });
});
//forget password
const doctorResetPasswordToDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { newPassword, confirmPassword } = payload;
    //isExist token
    const isExistToken = yield doctorResetToken_model_1.DoctorResetToken.isExistToken(token);
    if (!isExistToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }
    //user permission check
    const isExistUser = yield doctor_model_1.Doctor.findById(isExistToken.user).select('+authentication');
    if (!((_a = isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.authentication) === null || _a === void 0 ? void 0 : _a.isResetPassword)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You don't have permission to change the password. Please click again to 'Forgot Password'");
    }
    //validity check
    const isValid = yield doctorResetToken_model_1.DoctorResetToken.isExpireToken(token);
    if (!isValid) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token expired, Please click again to the forget password');
    }
    //check password
    if (newPassword !== confirmPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!");
    }
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
        authentication: {
            isResetPassword: false,
        },
    };
    yield doctor_model_1.Doctor.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
        new: true,
    });
});
const userChangePasswordToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmPassword } = payload;
    const isExistUser = yield user_model_1.User.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //current password match
    if (currentPassword &&
        !(yield user_model_1.User.isMatchPassword(currentPassword, isExistUser.password))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect');
    }
    //newPassword and current password
    if (currentPassword === newPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please give different password from current password');
    }
    //new password and confirm password check
    if (newPassword !== confirmPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password and Confirm password doesn't matched");
    }
    //hash password
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
    };
    yield user_model_1.User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
    const value = {
        receiver: isExistUser._id,
        text: 'Your password changed successfully',
    };
});
const doctorChangePasswordToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmPassword } = payload;
    const isExistUser = yield doctor_model_1.Doctor.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //current password match
    if (currentPassword &&
        !(yield doctor_model_1.Doctor.isMatchPassword(currentPassword, isExistUser.password))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect');
    }
    //newPassword and current password
    if (currentPassword === newPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please give different password from current password');
    }
    //new password and confirm password check
    if (newPassword !== confirmPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password and Confirm password doesn't matched");
    }
    //hash password
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
    };
    yield doctor_model_1.Doctor.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
    const value = {
        receiver: isExistUser._id,
        text: 'Your password changed successfully',
    };
});
const deleteAccountToDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(user.id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No User found');
    }
    return result;
});
const userNewAccessTokenToUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the token is provided
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token is required!');
    }
    const verifyUser = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_refresh_secret);
    const isExistUser = yield user_model_1.User.findById(verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized access');
    }
    //create token
    const accessToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
    return { accessToken };
});
const newAccessTokenToUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the token is provided
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token is required!');
    }
    const verifyUser = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_refresh_secret);
    const isExistUser = yield doctor_model_1.Doctor.findById(verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized access');
    }
    //create token
    const accessToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
    return { accessToken };
});
exports.AuthService = {
    userVerifyEmailToDB,
    doctorVerifyEmailToDB,
    doctorForgetPasswordToDB,
    userForgetPasswordToDB,
    deleteAccountToDB,
    newAccessTokenToUser,
    userNewAccessTokenToUser,
    userChangePasswordToDB,
    doctorChangePasswordToDB,
    userResetPasswordToDB,
    doctorResetPasswordToDB,
    userResendOtp,
    doctorResendOtp,
};
