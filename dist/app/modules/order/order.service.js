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
exports.OrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const order_model_1 = require("./order.model");
const createOrderToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.OrderModel.create(payload);
    return result;
});
const getSingleOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.OrderModel.findById(id).populate('appointmentId');
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found!');
    }
    return order;
});
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.QueryBuilder(order_model_1.OrderModel.find().populate('appointmentId'), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return { result, meta };
});
const updateOrder = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.OrderModel.findById(id);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found!');
    }
    const updatedOrder = yield order_model_1.OrderModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return updatedOrder;
});
exports.OrderService = {
    createOrderToDB,
    getSingleOrder,
    updateOrder,
    getAllOrders,
};
