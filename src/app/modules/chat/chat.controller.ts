import { Types } from 'mongoose';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatServices } from './chat.service';
import { StatusCodes } from 'http-status-codes';

// Create a new chat message
const createChatWithImage = catchAsync(async (req, res) => {
   console.log(req.body);
  const data = JSON.parse(req.body.data);
 console.log("parse data",data);
  const result = await ChatServices.createChatWithImage({
    senderId: new Types.ObjectId(data.senderId),
    receiverId: new Types.ObjectId(data.receiverId),
    senderModel: data.senderModel,
    receiverModel: data.receiverModel,
    message: data.message,
    seenBy: [data.senderId],
  },req);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Chat message created successfully.',
  });
});

const getAllChats = catchAsync(async (req, res) => {
  const result = await ChatServices.getAllChats(req.body, req.query);
  sendResponse(res, {
    pagination: result.meta,
    data: result.result,

    success: true,
    statusCode: StatusCodes.OK,
    message: 'All chats fetched successfully.',
  });
});

const chatList = catchAsync(async (req, res) => {
  const result = await ChatServices.chatList(req.params.userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All chats fetched successfully.',
  });
}
);

export const ChatController = {
  createChatWithImage,
  getAllChats,
  chatList
};
