"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ChatServices = void 0;
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const socket_1 = require("../../socket/socket");
const doctor_model_1 = require("../doctor/doctor.model");
const user_model_1 = require("../user/user.model");
const chat_model_1 = __importStar(require("./chat.model")); // Import the Chat model
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const createChat = (chatData) => __awaiter(void 0, void 0, void 0, function* () {
    const [isSenderExist, isReceiverExist] = yield Promise.all([
        chatData.senderModel === 'User'
            ? user_model_1.User.findOne({ _id: chatData.senderId })
            : doctor_model_1.Doctor.findOne({ _id: chatData.senderId }),
        chatData.receiverModel === 'User'
            ? user_model_1.User.findOne({ _id: chatData.receiverId })
            : doctor_model_1.Doctor.findOne({ _id: chatData.receiverId }),
    ]);
    console.log(isSenderExist);
    if (!(isSenderExist === null || isSenderExist === void 0 ? void 0 : isSenderExist._id) || !(isReceiverExist === null || isReceiverExist === void 0 ? void 0 : isReceiverExist._id)) {
        throw new AppError_1.default(404, 'User not found.');
    }
    const chat = new chat_model_1.default(Object.assign(Object.assign({}, chatData), { seenBy: [chatData.senderId] }));
    if (chatData && isReceiverExist.fcmToken) {
        const message = {
            token: isReceiverExist.fcmToken, // Device FCM Token
            notification: {
                title: `New Message from  ${isSenderExist.name}`, // Title of the notification
                body: `${chatData.message}`, // Message
            },
            data: {
                extraData: `${chatData.message}`,
            },
        };
        yield firebase_admin_1.default.messaging().send(message);
    }
    return yield chat.save();
});
const createChatWithImage = (chatData, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files.image) {
        throw new AppError_1.default(400, 'Image is required.');
    }
    const { senderId, receiverId, message } = chatData;
    console.log(req.files);
    const image = req.files.image[0];
    const imageUrl = `/images/${image.filename}`;
    chatData.file = imageUrl;
    const [isSenderExist, isReceiverExist] = yield Promise.all([
        chatData.senderModel === 'User'
            ? user_model_1.User.findOne({ _id: chatData.senderId })
            : doctor_model_1.Doctor.findOne({ _id: chatData.senderId }),
        chatData.receiverModel === 'User'
            ? user_model_1.User.findOne({ _id: chatData.receiverId })
            : doctor_model_1.Doctor.findOne({ _id: chatData.receiverId }),
    ]);
    if (!(isSenderExist === null || isSenderExist === void 0 ? void 0 : isSenderExist._id) || !(isReceiverExist === null || isReceiverExist === void 0 ? void 0 : isReceiverExist._id)) {
        throw new AppError_1.default(404, 'User not found.');
    }
    // //sender
    socket_1.io.emit(`receiver-${chatData.senderId}`, {
        senderId: chatData.senderId,
        receiverId: chatData.receiverId,
        senderModel: chatData.senderModel,
        receiverModel: chatData.receiverModel,
        message: chatData.message,
        file: chatData.file,
        seenBy: chatData.seenBy,
    });
    //receiver
    socket_1.io.emit(`receiver-${chatData.receiverId}`, {
        senderId: chatData.senderId,
        receiverId: chatData.receiverId,
        senderModel: chatData.senderModel,
        receiverModel: chatData.receiverModel,
        message: chatData.message,
        file: chatData.file,
        seenBy: chatData.seenBy,
    });
    const updateOrCreateChatRoom = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            const chatRoom = yield chat_model_1.ChatRoom.findOne({
                $or: [
                    { participant1: senderId, participant2: receiverId },
                    { participant1: receiverId, participant2: senderId },
                ],
            });
            if (chatRoom) {
                chatRoom.lastMessage = message; // Update last message
                chatRoom.lastMessageBy = senderId.toString() || 'send an image'; // Update last message by
                chatRoom.lastMessageTime = new Date(); // Update last message time
                yield chatRoom.save();
            }
            else {
                const newChat = new chat_model_1.ChatRoom({
                    participant1: senderId,
                    participant2: receiverId,
                    senderModel: chatData.senderModel,
                    receiverModel: chatData.receiverModel,
                    lastMessage: message || 'send an image',
                    lastMessageBy: senderId.toString(),
                    lastMessageTime: new Date(),
                });
                yield newChat.save();
            }
            const finalChatRoomData = yield chat_model_1.ChatRoom.findOne({
                $or: [
                    { participant1: senderId, participant2: receiverId },
                    { participant1: receiverId, participant2: senderId },
                ],
            })
                .populate('participant1', 'name image')
                .populate('participant2', 'name image');
            console.log(senderId, receiverId);
            if (!finalChatRoomData) {
                return;
            }
            // Determine which participant is sender and which is receiver
            const isSenderParticipant1 = finalChatRoomData.participant1._id.toString() === senderId.toString();
            // Sender gets receiver's data
            const senderData = {
                partnerId: receiverId.toString(),
                name: isSenderParticipant1
                    ? (_a = finalChatRoomData.participant2) === null || _a === void 0 ? void 0 : _a.name
                    : (_b = finalChatRoomData.participant1) === null || _b === void 0 ? void 0 : _b.name,
                image: isSenderParticipant1
                    ? (_c = finalChatRoomData.participant2) === null || _c === void 0 ? void 0 : _c.image
                    : (_d = finalChatRoomData.participant1) === null || _d === void 0 ? void 0 : _d.image,
                model: chatData.receiverModel,
                lastMsg: finalChatRoomData.lastMessage || 'send an image',
                lastMsgTime: finalChatRoomData.lastMessageTime,
                lastMsgBy: finalChatRoomData.lastMessageBy,
            };
            // Receiver gets sender's data
            const receiverData = {
                partnerId: senderId.toString(),
                name: isSenderParticipant1
                    ? (_e = finalChatRoomData.participant1) === null || _e === void 0 ? void 0 : _e.name
                    : (_f = finalChatRoomData.participant2) === null || _f === void 0 ? void 0 : _f.name,
                image: isSenderParticipant1
                    ? (_g = finalChatRoomData.participant1) === null || _g === void 0 ? void 0 : _g.image
                    : (_h = finalChatRoomData.participant2) === null || _h === void 0 ? void 0 : _h.image,
                model: chatData.senderModel,
                lastMsg: finalChatRoomData.lastMessage || 'send an image',
                lastMsgTime: finalChatRoomData.lastMessageTime,
                lastMsgBy: finalChatRoomData.lastMessageBy,
            };
            socket_1.io.emit(`updated-chat-list-${senderId}`, Object.assign({}, senderData));
            socket_1.io.emit(`updated-chat-list-${receiverId}`, Object.assign({}, receiverData));
        }
        catch (err) {
            console.log(err);
        }
    });
    updateOrCreateChatRoom();
    const chat = new chat_model_1.default(Object.assign(Object.assign({}, chatData), { seenBy: [chatData.senderId] }));
    if (chatData && isReceiverExist.fcmToken) {
        const message = {
            token: isReceiverExist.fcmToken, // Device FCM Token
            notification: {
                title: `New Image from  ${isSenderExist.name}`, // Title of the notification
                body: "New Image", // Message
            },
            data: {
                extraData: `${chatData.message}`,
            },
        };
        yield firebase_admin_1.default.messaging().send(message);
    }
    return yield chat.save();
});
const getAllChats = (payload, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.sender || !payload.receiver) {
        throw new AppError_1.default(400, 'Sender and receiver are required.');
    }
    if (payload.sender === payload.receiver) {
        throw new AppError_1.default(400, 'Sender and receiver cannot be the same.');
    }
    const chatQuery = new QueryBuilder_1.QueryBuilder(chat_model_1.default.find({
        $or: [
            {
                senderId: payload.sender,
                receiverId: payload.receiver,
            },
            {
                senderId: payload.receiver,
                receiverId: payload.sender,
            },
        ],
    }), query)
        // .search(['message'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield chatQuery.modelQuery;
    const meta = yield chatQuery.countTotal();
    return { result, meta };
});
const chatList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all chat rooms where the user is a participant
    const chatRooms = (yield chat_model_1.ChatRoom.find({
        $or: [{ participant1: userId }, { participant2: userId }],
    })
        .populate('participant1', 'name image role')
        .populate('participant2', 'name image role')
        .sort({ lastMessageTime: -1 })
        .lean());
    // Format the chat list to return
    const formattedChatList = chatRooms.map((room) => {
        var _a;
        // Determine if userId is participant1 or participant2
        const isUserParticipant1 = room.participant1._id.toString() === userId;
        // Get partner's details
        const partnerId = isUserParticipant1
            ? room.participant2._id.toString()
            : room.participant1._id.toString();
        const partnerName = isUserParticipant1
            ? room.participant2.name
            : room.participant1.name;
        const partnerImage = isUserParticipant1
            ? room.participant2.image || ''
            : room.participant1.image || '';
        let partnerModel = isUserParticipant1
            ? room.participant2.role
            : room.participant1.role;
        if (partnerModel !== 'DOCTOR') {
            partnerModel = 'User';
        }
        if (partnerModel === 'DOCTOR') {
            partnerModel = 'Doctor';
        }
        return {
            partnerId,
            name: partnerName,
            image: partnerImage,
            model: partnerModel,
            lastMsg: room.lastMessage,
            lastMsgTime: room.lastMessageTime,
            lastMsgBy: room.lastMessageBy,
            unreadCount: ((_a = room.seenBy) === null || _a === void 0 ? void 0 : _a.includes(userId)) ? 0 : 1, // Basic unread counter
        };
    });
    return formattedChatList;
});
exports.ChatServices = {
    createChat,
    createChatWithImage,
    getAllChats,
    chatList,
};
