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
exports.SettingService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const setting_model_1 = require("./setting.model");
const createSetting = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistSetting = yield setting_model_1.Setting.findOne();
    if (isExistSetting) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Setting already exist!');
    }
    const setting = yield setting_model_1.Setting.create(payload);
    return setting;
});
const getSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield setting_model_1.Setting.findOne({});
    return settings;
});
const updateSetting = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield setting_model_1.Setting.findOne();
    if (!setting) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Setting not found!');
    }
    const updatedSetting = yield setting_model_1.Setting.findOneAndUpdate({}, payload, {
        new: true,
    });
    return updatedSetting;
});
exports.SettingService = {
    createSetting,
    updateSetting,
    getSettings,
};
