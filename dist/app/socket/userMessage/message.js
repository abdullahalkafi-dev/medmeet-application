"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSendMessage = void 0;
const mongoose_1 = require("mongoose");
const socket_1 = require("../socket");
const chat_service_1 = require("../../modules/chat/chat.service");
const handleSendMessage = (data) => {
    console.log(`
    
    
    
    
    
    ${data}
    
    
    
    
    `);
    socket_1.io.emit(`receiver-${data.receiverId}`, {
        senderId: data.senderId,
        receiverId: data.receiverId,
        senderModel: data.senderModel,
        receiverModel: data.receiverModel,
        message: data.message,
        file: data.file,
        seenBy: data.seenBy,
    });
    if (data.message && data.receiverId && data.senderId) {
        console.log('inner', data);
        chat_service_1.ChatServices.createChat({
            senderId: new mongoose_1.Types.ObjectId(data.senderId),
            receiverId: new mongoose_1.Types.ObjectId(data.receiverId),
            senderModel: data.senderModel,
            receiverModel: data.receiverModel,
            message: data.message,
            seenBy: [data.senderId],
        });
    }
};
exports.handleSendMessage = handleSendMessage;
