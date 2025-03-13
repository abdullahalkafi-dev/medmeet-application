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
exports.ChatController = void 0;
const mongoose_1 = require("mongoose");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const chat_service_1 = require("./chat.service");
const http_status_codes_1 = require("http-status-codes");
// Create a new chat message
const createChatWithImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const data = JSON.parse(req.body.data);
    console.log("parse data", data);
    const result = yield chat_service_1.ChatServices.createChatWithImage({
        senderId: new mongoose_1.Types.ObjectId(data.senderId),
        receiverId: new mongoose_1.Types.ObjectId(data.receiverId),
        senderModel: data.senderModel,
        receiverModel: data.receiverModel,
        message: data.message,
        seenBy: [data.senderId],
    }, req);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Chat message created successfully.',
    });
}));
const getAllChats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chat_service_1.ChatServices.getAllChats(req.body, req.query);
    (0, sendResponse_1.default)(res, {
        pagination: result.meta,
        data: result.result,
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'All chats fetched successfully.',
    });
}));
const chatList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chat_service_1.ChatServices.chatList(req.params.userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'All chats fetched successfully.',
    });
}));
exports.ChatController = {
    createChatWithImage,
    getAllChats,
    chatList
};
