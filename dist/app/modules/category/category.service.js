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
exports.CategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const category_model_1 = require("./category.model");
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const doctor_model_1 = require("../doctor/doctor.model");
const createCategoryToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistCategory = yield category_model_1.Category.findOne({
        name: payload.name,
    });
    if (isExistCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Category already exist!');
    }
    const result = yield category_model_1.Category.create(payload);
    return result;
});
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(id);
    if (!category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Category not found!');
    }
    return category;
});
const getAllCategories = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryQuery = new QueryBuilder_1.QueryBuilder(category_model_1.Category.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield categoryQuery.modelQuery;
    const meta = yield categoryQuery.countTotal();
    return { result, meta };
});
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(id);
    if (!category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Category not found!');
    }
    const alreadyExistCategory = yield category_model_1.Category.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (alreadyExistCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Category already exist!');
    }
    const updatedCategory = yield category_model_1.Category.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return updatedCategory;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isAnyDoctorHasThisCategory = yield doctor_model_1.Doctor.findOne({
        specialist: id,
    });
    if (isAnyDoctorHasThisCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Category is associated with doctor!');
    }
    const category = yield category_model_1.Category.findByIdAndDelete(id);
    if (!category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Category not found!');
    }
    return category;
});
exports.CategoryService = {
    createCategoryToDB,
    getSingleCategory,
    updateCategory,
    getAllCategories,
    deleteCategory
};
