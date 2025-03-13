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
exports.Doctor = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const user_1 = require("../../../enums/user");
const doctorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(user_1.USER_ROLES),
        required: true,
        default: user_1.USER_ROLES.DOCTOR,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    fcmToken: {
        type: String,
    },
    dob: {
        type: Date,
    },
    country: {
        type: String,
        required: true,
    },
    doctorId: {
        type: String,
    },
    specialist: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    experience: {
        type: Number,
    },
    clinic: {
        type: String,
    },
    clinicAddress: {
        type: String,
    },
    consultationFee: {
        type: Number,
    },
    aboutDoctor: {
        type: String,
    },
    professionalIdFront: {
        type: String,
    },
    professionalIdBack: {
        type: String,
    },
    medicalLicense: {
        type: String,
    },
    image: {
        type: String,
    },
    subscription: {
        type: Boolean,
    },
    avgRating: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8,
    },
    status: {
        type: String,
        enum: ['active', 'delete'],
        default: 'active',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    approvedStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    isAllFieldsFilled: {
        type: Boolean,
        default: false,
    },
    authentication: {
        type: {
            isResetPassword: {
                type: Boolean,
                default: false,
            },
            oneTimeCode: {
                type: Number,
                default: null,
            },
            expireAt: {
                type: Date,
                default: null,
            },
        },
        select: false,
    },
}, { timestamps: true });
doctorSchema.index({ email: 1 });
doctorSchema.index({ doctorId: 1 });
//exist user check
doctorSchema.statics.isExistDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.Doctor.findById(id);
    return isExist;
});
doctorSchema.statics.isExistDoctorByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.Doctor.findOne({ email });
    return isExist;
});
doctorSchema.statics.isExistDoctorByPhnNum = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.Doctor.findOne({ phoneNumber });
    return isExist;
});
//is match password
doctorSchema.statics.isMatchPassword = (password, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashPassword);
});
//check if JWT issued before password changed
doctorSchema.statics.isJWTIssuedBeforePasswordChanged = (passwordChangedTimestamp, jwtIssuedTimestamp) => {
    return jwtIssuedTimestamp < passwordChangedTimestamp.getTime();
};
//check user
doctorSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //password hash
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
exports.Doctor = (0, mongoose_1.model)('Doctor', doctorSchema);
