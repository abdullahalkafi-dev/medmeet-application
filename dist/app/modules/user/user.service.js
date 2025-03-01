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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const user_model_1 = require("./user.model");
const user_1 = require("../../../enums/user");
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate required fields
    const isExist = yield user_model_1.User.findOne({
        email: payload.email,
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User already exist');
    }
    // Create user first
    const user = yield user_model_1.User.create(payload);
    return user;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { uniqueId, password } = payload;
    if (!uniqueId || !password) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide email and password');
    }
    const user = yield user_model_1.User.findOne({
        email: uniqueId,
    }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    console.log(password, user.password);
    const isMatch = yield user_model_1.User.isMatchPassword(password, user.password);
    if (!isMatch) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid credentials');
    }
    const accessToken = jwtHelper_1.jwtHelper.createToken({
        id: user._id,
        role: user.role,
        email: user.email,
    }, config_1.default.jwt.jwt_secret, '90d');
    //create token
    const refreshToken = jwtHelper_1.jwtHelper.createToken({ id: user._id, role: user.role, email: user.email }, config_1.default.jwt.jwt_refresh_secret, '150d');
    const _a = user.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return { accessToken, refreshToken, user: userWithoutPassword };
});
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.findById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const updateUserProfileToDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = userId;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (payload.image &&
        isExistUser.image &&
        !isExistUser.image.includes('default_profile.jpg') &&
        !payload.image.includes(isExistUser.image)) {
        (0, unlinkFile_1.default)(isExistUser.image);
    }
    if (payload.dob) {
        const [day, month, year] = payload.dob.split('-');
        payload.dob = new Date(`${year}-${month}-${day}`);
        console.log(payload.dob);
    }
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        upsert: true,
    });
    let finalUserDocument;
    if (!updateDoc.isAllFieldsFilled &&
        updateDoc &&
        !!(updateDoc.image &&
            updateDoc.phoneNumber &&
            updateDoc.gender &&
            updateDoc.dob &&
            updateDoc.country)) {
        finalUserDocument = yield user_model_1.User.findOneAndUpdate({ _id: id }, { isAllFieldsFilled: true }, { new: true });
    }
    return finalUserDocument ? finalUserDocument : updateDoc;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
//get all users
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    return { result, meta };
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, { status: 'delete' }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (result.role === user_1.USER_ROLES.SUPER_ADMIN) {
        yield user_model_1.User.findByIdAndUpdate(id, { status: 'active' }, { new: true });
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can't delete super admin!");
    }
    return result;
});
exports.UserService = {
    getUserProfileFromDB,
    updateUserProfileToDB,
    getSingleUser,
    createUserToDB,
    getAllUsers,
    loginUser,
    deleteUser,
};
