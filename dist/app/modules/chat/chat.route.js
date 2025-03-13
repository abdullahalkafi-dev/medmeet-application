"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = require("express");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const chat_controller_1 = require("./chat.controller");
const router = (0, express_1.Router)();
router.post('/chat', fileUploadHandler_1.default, (0, auth_1.default)(), chat_controller_1.ChatController.createChatWithImage);
router.post('/', chat_controller_1.ChatController.getAllChats);
router.get('/chat/:userId', chat_controller_1.ChatController.chatList);
exports.ChatRoutes = router;
