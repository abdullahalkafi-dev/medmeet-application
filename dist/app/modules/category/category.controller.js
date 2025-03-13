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
exports.CategoryController = void 0;
const http_status_codes_1 = require("http-status-codes");
const category_service_1 = require("./category.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const createCategoryToDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const categoryData = JSON.parse(req.body.data);
    const data = Object.assign({ image }, categoryData);
    const category = yield category_service_1.CategoryService.createCategoryToDB(data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category created successfully',
        data: category,
    });
}));
const getSingleCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_service_1.CategoryService.getSingleCategory(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category retrieved successfully',
        data: category,
    });
}));
const getAllCategories = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_service_1.CategoryService.getAllCategories(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Categories retrieved successfully',
        data: categories.result,
        pagination: categories.meta,
    });
}));
const updateCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const categoryData = JSON.parse(req.body.data);
    const data = Object.assign({ image }, categoryData);
    const result = yield category_service_1.CategoryService.updateCategory(id, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category updated successfully',
        data: result,
    });
}));
const deleteCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_service_1.CategoryService.deleteCategory(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category deleted successfully',
        data: category,
    });
}));
exports.CategoryController = {
    createCategoryToDB,
    getSingleCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
