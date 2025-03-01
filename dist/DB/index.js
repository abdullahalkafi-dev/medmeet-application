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
const colors_1 = __importDefault(require("colors"));
const user_model_1 = require("../app/modules/user/user.model");
const config_1 = __importDefault(require("../config"));
const user_1 = require("../enums/user");
const logger_1 = require("../shared/logger");
const superUser = {
    name: 'null',
    role: user_1.USER_ROLES.SUPER_ADMIN,
    email: config_1.default.super_admin.email,
    password: config_1.default.super_admin.password,
    verified: true,
    address: 'N/A',
    phoneNumber: 'N/A',
    country: 'N/A',
    gender: 'Male',
    subscription: true,
    isAllFieldsFilled: true,
    dob: new Date('01-01-2000'),
    image: 'https://i.ibb.co.com/2sw32KM/user.png',
    status: 'active',
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isExistSuperAdmin = yield user_model_1.User.findOne({
        role: user_1.USER_ROLES.SUPER_ADMIN,
    });
    if (!isExistSuperAdmin) {
        yield user_model_1.User.create(superUser);
        logger_1.logger.info(colors_1.default.green('✔ Super admin created successfully!'));
    }
});
exports.default = seedSuperAdmin;
