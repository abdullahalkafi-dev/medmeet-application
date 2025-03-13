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
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.setupSocket = exports.users = void 0;
const socket_io_1 = require("socket.io");
const message_1 = require("./userMessage/message");
const mongoose_1 = require("mongoose");
const chat_model_1 = require("../modules/chat/chat.model");
exports.users = new Map();
let io; // Store io instance globally
const setupSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: ['*', 'http://localhost:3000', 'http://localhost:5173'],
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', socket => {
        console.log('new user connected');
        socket.on('register', userId => {
            exports.users.set(userId, socket.id);
            io.emit('onlineUsers', Array.from(exports.users.keys()));
        });
        socket.on('sendMessage', textData => {
            console.log(textData);
            const data = JSON.parse(textData);
            const { senderId, receiverId, message } = data;
            console.log(data);
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
                        chatRoom.lastMessageBy = senderId.toString(); // Update last message by
                        chatRoom.lastMessageTime = new Date(); // Update last message time
                        yield chatRoom.save();
                    }
                    else {
                        const newChat = new chat_model_1.ChatRoom({
                            participant1: senderId,
                            participant2: receiverId,
                            senderModel: data.senderModel,
                            receiverModel: data.receiverModel,
                            lastMessage: message,
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
                    const isSenderParticipant1 = finalChatRoomData.participant1._id.toString() ===
                        senderId.toString();
                    // Sender gets receiver's data
                    const senderData = {
                        partnerId: receiverId.toString(),
                        name: isSenderParticipant1
                            ? (_a = finalChatRoomData.participant2) === null || _a === void 0 ? void 0 : _a.name
                            : (_b = finalChatRoomData.participant1) === null || _b === void 0 ? void 0 : _b.name,
                        image: isSenderParticipant1
                            ? (_c = finalChatRoomData.participant2) === null || _c === void 0 ? void 0 : _c.image
                            : (_d = finalChatRoomData.participant1) === null || _d === void 0 ? void 0 : _d.image,
                        model: data.receiverModel,
                        lastMsg: finalChatRoomData.lastMessage,
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
                        model: data.senderModel,
                        lastMsg: finalChatRoomData.lastMessage,
                        lastMsgTime: finalChatRoomData.lastMessageTime,
                        lastMsgBy: finalChatRoomData.lastMessageBy,
                    };
                    io.emit(`updated-chat-list-${senderId}`, Object.assign({}, senderData));
                    io.emit(`updated-chat-list-${receiverId}`, Object.assign({}, receiverData));
                }
                catch (err) {
                    console.log(err);
                }
            });
            updateOrCreateChatRoom();
            (0, message_1.handleSendMessage)({
                senderId: new mongoose_1.Types.ObjectId(data.senderId),
                receiverId: new mongoose_1.Types.ObjectId(data.receiverId),
                senderModel: data.senderModel,
                receiverModel: data.receiverModel,
                message,
                seenBy: [senderId],
            });
        });
        socket.on('disconnect', () => {
            exports.users.forEach((socketId, userId) => {
                if (socketId === socket.id) {
                    exports.users.delete(userId);
                }
            });
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
