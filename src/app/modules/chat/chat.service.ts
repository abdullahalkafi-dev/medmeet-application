import AppError from '../../errors/AppError';
import { io } from '../../socket/socket';
import { Doctor } from '../doctor/doctor.model';
import { User } from '../user/user.model';
import { IChat } from './chat.interface';
import Chat from './chat.model'; // Import the Chat model

const createChat = async (chatData: IChat) => {
  console.log('more inner chat', chatData);
  const [isSenderExist, isReceiverExist] = await Promise.all([
    chatData.senderModel === 'User'
      ? User.findOne({ _id: chatData.senderId })
      : Doctor.findOne({ _id: chatData.senderId }),
    chatData.receiverModel === 'User'
      ? User.findOne({ _id: chatData.receiverId })
      : Doctor.findOne({ _id: chatData.receiverId }),
  ]);
  console.log(isSenderExist);
  if (!isSenderExist?._id || !isReceiverExist?._id) {
    throw new AppError(404, 'User not found.');
  }

  const chat = new Chat({ ...chatData, seenBy: [chatData.senderId] });
  return await chat.save();
};

const createChatWithImage = async (chatData: IChat, req: any) => {
  if (!req.files.image) {
    throw new AppError(400, 'Image is required.');
  }
  const image = req.files.image as Express.Multer.File;
  const imageUrl = `/images/${image.filename}`;
  chatData.file = imageUrl;
  const [isSenderExist, isReceiverExist] = await Promise.all([
    chatData.senderModel === 'User'
      ? User.findOne({ _id: chatData.senderId })
      : Doctor.findOne({ _id: chatData.senderId }),
    chatData.receiverModel === 'User'
      ? User.findOne({ _id: chatData.receiverId })
      : Doctor.findOne({ _id: chatData.receiverId }),
  ]);
  if (!isSenderExist?._id || !isReceiverExist?._id) {
    throw new AppError(404, 'User not found.');
  }
  // //sender
  io.emit(`receiver-${chatData.senderId}`, {
    senderId: chatData.senderId,
    receiverId: chatData.receiverId,
    senderModel: chatData.senderModel,
    receiverModel: chatData.receiverModel,
    message: chatData.message,
    file: chatData.file,
    seenBy: chatData.seenBy,
  });
  //receiver
  io.emit(`receiver-${chatData.receiverId}`, {
    senderId: chatData.senderId,
    receiverId: chatData.receiverId,
    senderModel: chatData.senderModel,
    receiverModel: chatData.receiverModel,
    message: chatData.message,
    file: chatData.file,
    seenBy: chatData.seenBy,
  });

  const chat = new Chat({ ...chatData, seenBy: [chatData.senderId] });
  return await chat.save();
};

export const ChatServices = {
  createChat,
  createChatWithImage,
};
