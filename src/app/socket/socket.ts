import { Server } from 'socket.io';
import { handleSendMessage } from './userMessage/message';
import { Types } from 'mongoose';

export const users = new Map();
let io: Server; // Store io instance globally
const setupSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: ['*', 'http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', socket => {
    socket.on('register', userId => {
      users.set(userId, socket.id);
      io.emit('onlineUsers', Array.from(users.keys()));
    });

    socket.on(
      'sendMessage',
      (data: {
        senderId: Types.ObjectId;
        receiverId: Types.ObjectId;
        senderModel: 'User' | 'Doctor';
        receiverModel: 'User' | 'Doctor';
        message?: string;
        seenBy: string[];
      }) => {
      
        const { senderId, receiverId, message } = data;
        socket.emit('newMessage', { data });
        console.log('outer', data);
        handleSendMessage({
          senderId: new Types.ObjectId(data.senderId),
          receiverId: new Types.ObjectId(data.receiverId),
          senderModel: data.senderModel,
          receiverModel: data.receiverModel,
          message,
          seenBy: [senderId as any],
        });
      }
    );
    socket.on('disconnect', () => {
      users.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          users.delete(userId);
        }
      });
    });
  });

  return io;
};

export { setupSocket, io };
