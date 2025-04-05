import { Server } from "socket.io";
import { handleSendMessage } from "./userMessage/message";
import { Types } from "mongoose";
import { ChatRoom } from "../modules/chat/chat.model";

export const users = new Map();

export const activeChatUsers = new Map(); // Map to track active chat sessions

let io: Server; // Store io instance globally
const setupSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: ["*", "http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", socket => {
    console.log("new user connected");
    socket.on("register", userId => {
      users.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(users.keys()));
    });

    socket.on("activeChat", data => {
      // data contains { userId, activeChatPartnerId }
      if (data.activeChatPartnerId) {
        activeChatUsers.set(data.userId, data.activeChatPartnerId);
      } else {
        activeChatUsers.delete(data.userId);
      }
    });
    socket.on("sendMessage", textData => {
      const data = JSON.parse(textData);
      const { senderId, receiverId, message } = data;

      const updateOrCreateChatRoom = async () => {
        try {
          const chatRoom = await ChatRoom.findOne({
            $or: [
              { participant1: senderId, participant2: receiverId },
              { participant1: receiverId, participant2: senderId },
            ],
          });
          if (chatRoom) {
            chatRoom.lastMessage = message; // Update last message
            chatRoom.lastMessageBy = senderId.toString(); // Update last message by
            chatRoom.lastMessageTime = new Date(); // Update last message time
            await chatRoom.save();
          } else {
            const newChat = new ChatRoom({
              participant1: senderId,
              participant2: receiverId,
              senderModel: data.senderModel,
              receiverModel: data.receiverModel,
              lastMessage: message,
              lastMessageBy: senderId.toString(),
              lastMessageTime: new Date(),
            });
            await newChat.save();
          }
          const finalChatRoomData: any = await ChatRoom.findOne({
            $or: [
              { participant1: senderId, participant2: receiverId },
              { participant1: receiverId, participant2: senderId },
            ],
          })
            .populate("participant1", "name image")
            .populate("participant2", "name image");

          if (!finalChatRoomData) {
            return;
          }
      
          // Determine which participant is sender and which is receiver
          const isSenderParticipant1 =
            finalChatRoomData.participant1._id.toString() ===
            senderId.toString();

          // Sender gets receiver's data
          const senderData = {
            partnerId: receiverId.toString(),
            name: isSenderParticipant1
              ? finalChatRoomData.participant2?.name
              : finalChatRoomData.participant1?.name,
            image: isSenderParticipant1
              ? finalChatRoomData.participant2?.image
              : finalChatRoomData.participant1?.image,

            model: data.receiverModel,
            lastMsg: finalChatRoomData.lastMessage,
            lastMsgTime: finalChatRoomData.lastMessageTime,
            lastMsgBy: finalChatRoomData.lastMessageBy,
          };

          // Receiver gets sender's data
          const receiverData = {
            partnerId: senderId.toString(),
            name: isSenderParticipant1
              ? finalChatRoomData.participant1?.name
              : finalChatRoomData.participant2?.name,
            image: isSenderParticipant1
              ? finalChatRoomData.participant1?.image
              : finalChatRoomData.participant2?.image,

            model: data.senderModel,
            lastMsg: finalChatRoomData.lastMessage,
            lastMsgTime: finalChatRoomData.lastMessageTime,
            lastMsgBy: finalChatRoomData.lastMessageBy,
          };

          io.emit(`updated-chat-list-${senderId}`, { ...senderData });
          io.emit(`updated-chat-list-${receiverId}`, {
            ...receiverData,
          });
        } catch (err) {
          console.log(err);
        }
      };
      updateOrCreateChatRoom();
      handleSendMessage({
        senderId: new Types.ObjectId(data.senderId),
        receiverId: new Types.ObjectId(data.receiverId),
        senderModel: data.senderModel,
        receiverModel: data.receiverModel,
        message,
        seenBy: [senderId as any],
      });
    });
    socket.on("disconnect", () => {
      users.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          users.delete(userId);
          activeChatUsers.delete(userId); // Remove user from active chat users
        }
      });
    });
  });

  return io;
};

export { setupSocket, io };
