"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel', // Dynamic reference
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel', // Dynamic reference
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Doctor'], // Can be "User" or "Doctor"
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'Doctor'], // Can be "User" or "Doctor"
    },
    message: {
        type: String,
    },
    file: {
        type: String,
    },
    seenBy: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
// Custom validator to ensure either message or file is present
chatSchema.pre('validate', function (next) {
    if (!this.message && !this.file) {
        this.invalidate('message', 'Either message or file is required');
    }
    next();
});
const chatRoomSchema = new mongoose_1.Schema({
    participant1: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel', // Dynamic reference
    },
    participant2: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel', // Dynamic reference
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Doctor'], // Can be "User" or "Doctor"
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'Doctor'], // Can be "User" or "Doctor"
    },
    lastMessage: {
        type: String,
    },
    lastMessageBy: {
        type: String,
    },
    lastMessageTime: {
        type: Date,
    },
    file: {
        type: String,
    },
    seenBy: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
const Chat = (0, mongoose_1.model)('Chat', chatSchema);
exports.ChatRoom = (0, mongoose_1.model)('ChatRoom', chatRoomSchema);
exports.default = Chat;
