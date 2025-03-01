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
exports.MedicalRecordService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const medicalRecord_model_1 = require("./medicalRecord.model");
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const createMedicalRecord = (payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    let prescription;
    if (req.files.doc) {
        prescription = `/docs/${req.files.doc[0].filename}`;
    }
    else {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Prescription is required');
    }
    const parsedJSON = JSON.parse(payload);
    const result = yield medicalRecord_model_1.MedicalRecordModel.create(Object.assign(Object.assign({}, parsedJSON), { prescription }));
    return result;
});
const getAllMedicalRecords = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const medicalRecordQuery = new QueryBuilder_1.QueryBuilder(medicalRecord_model_1.MedicalRecordModel.find(), query)
        .search(['name', 'medicalHistory'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield medicalRecordQuery.countTotal();
    const result = yield medicalRecordQuery.modelQuery;
    return { result, meta };
});
const getMedicalRecordById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const medicalRecord = yield medicalRecord_model_1.MedicalRecordModel.findById(id);
    if (!medicalRecord) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Medical record not found!');
    }
    return medicalRecord;
});
const updateMedicalRecord = (id, payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    const medicalRecord = yield medicalRecord_model_1.MedicalRecordModel.findById(id);
    if (!medicalRecord) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Medical record not found!');
    }
    let prescription;
    if (req.files.doc) {
        prescription = `/docs/${req.files.doc[0].filename}`;
        payload.prescription = prescription;
    }
    const updatedMedicalRecord = yield medicalRecord_model_1.MedicalRecordModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return updatedMedicalRecord;
});
const deleteMedicalRecord = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const medicalRecord = yield medicalRecord_model_1.MedicalRecordModel.findById(id);
    if (!medicalRecord) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Medical record not found!');
    }
    yield medicalRecord_model_1.MedicalRecordModel.findByIdAndDelete(id);
    return medicalRecord;
});
exports.MedicalRecordService = {
    createMedicalRecord,
    getAllMedicalRecords,
    updateMedicalRecord,
    deleteMedicalRecord,
    getMedicalRecordById,
};
