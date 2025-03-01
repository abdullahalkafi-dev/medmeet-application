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
exports.MedicineService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const medicine_model_1 = require("./medicine.model");
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const createMedicine = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistMedicine = yield medicine_model_1.Medicine.findOne({
        name: payload.name,
    });
    if (isExistMedicine) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Medicine already exist!');
    }
    const result = yield medicine_model_1.Medicine.create(payload);
    return result;
});
const getAllMedicines = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const medicineQuery = new QueryBuilder_1.QueryBuilder(medicine_model_1.Medicine.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield medicineQuery.countTotal();
    const result = yield medicineQuery.modelQuery;
    return { result, meta };
});
const updateMedicine = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const medicine = yield medicine_model_1.Medicine.findById(id);
    if (!medicine) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Medicine not found!');
    }
    const alreadyExistMedicine = yield medicine_model_1.Medicine.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (alreadyExistMedicine) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Medicine already exist!');
    }
    const updatedMedicine = yield medicine_model_1.Medicine.findByIdAndUpdate(id, { name: payload.name }, {
        new: true,
    });
    return updatedMedicine;
});
const deleteMedicine = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const medicine = yield medicine_model_1.Medicine.findById(id);
    if (!medicine) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Medicine not found!');
    }
    yield medicine_model_1.Medicine.findByIdAndDelete(id);
    return medicine;
});
exports.MedicineService = {
    createMedicine,
    getAllMedicines,
    deleteMedicine,
    updateMedicine,
};
