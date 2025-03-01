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
exports.FaqService = void 0;
const http_status_codes_1 = require("http-status-codes");
const Faq_model_1 = require("./Faq.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const Faq_constant_1 = require("./Faq.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createFaqToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Faq_model_1.Faq.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create faq');
    }
    return result;
});
const getAllFaq = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const faqBuilder = new QueryBuilder_1.default(Faq_model_1.Faq.find(), query)
        .search(Faq_constant_1.faqSearchAbleFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield faqBuilder.modelQuery;
    return result;
});
const getSingleFaq = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Faq_model_1.Faq.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Faq not found');
    }
    return result;
});
const updateFaq = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Faq_model_1.Faq.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Faq not found');
    }
    return result;
});
const deleteFaq = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Faq_model_1.Faq.findByIdAndUpdate(id, { status: 'delete' }, { new: true, runValidators: true });
    return result;
});
exports.FaqService = {
    createFaqToDB,
    getAllFaq,
    getSingleFaq,
    updateFaq,
    deleteFaq,
};
