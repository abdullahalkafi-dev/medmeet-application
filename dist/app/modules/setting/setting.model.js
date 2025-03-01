"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const mongoose_1 = require("mongoose");
const settingSchema = new mongoose_1.Schema({
    privacyPolicy: {
        type: String,
        required: true,
        default: '',
    },
    termsAndConditions: {
        type: String,
        required: true,
        default: '',
    },
    aboutUs: {
        type: String,
        required: true,
        default: '',
    },
});
exports.Setting = (0, mongoose_1.model)('Setting', settingSchema);
