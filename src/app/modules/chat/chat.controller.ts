import { Types } from 'mongoose';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatServices } from './chat.service';
import { StatusCodes } from 'http-status-codes';

// Create a new chat message
const createChatWithImage = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await ChatServices.createChat({
    senderId: new Types.ObjectId(data.senderId),
    receiverId: new Types.ObjectId(data.receiverId),
    senderModel: data.senderModel,
    receiverModel: data.receiverModel,
    message: data.message,
    seenBy: [data.senderId],
   
  });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Chat message created successfully.',
  });
});
