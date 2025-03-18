import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { activeChatUsers, io } from '../../socket/socket';
import { Doctor } from '../doctor/doctor.model';
import { User } from '../user/user.model';
import { IChat } from './chat.interface';
import Chat, { ChatRoom } from './chat.model'; // Import the Chat model
import admin from 'firebase-admin';

const createChat = async (chatData: IChat) => {
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

  const activeChatPartner = activeChatUsers.get(chatData.receiverId.toString());

  if (activeChatPartner !== chatData.senderId.toString()) {
   
    if (chatData.message && chatData.receiverId && chatData.senderId) {
   
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

        await admin.messaging().send(message);
      }
    }
  }

  return await chat.save();
};

const createChatWithImage = async (chatData: IChat, req: any) => {
  if (!req.files.image) {
    throw new AppError(400, 'Image is required.');
  }
  const { senderId, receiverId, message } = chatData;

  const image = req.files.image[0] as Express.Multer.File;
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
        chatRoom.lastMessageBy = senderId.toString() || 'send an image'; // Update last message by
        chatRoom.lastMessageTime = new Date(); // Update last message time
        await chatRoom.save();
      } else {
        const newChat = new ChatRoom({
          participant1: senderId,
          participant2: receiverId,
          senderModel: chatData.senderModel,
          receiverModel: chatData.receiverModel,
          lastMessage: message || 'send an image',

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
        .populate('participant1', 'name image')
        .populate('participant2', 'name image');
      console.log(senderId, receiverId);

      if (!finalChatRoomData) {
        return;
      }

      // Determine which participant is sender and which is receiver
      const isSenderParticipant1 =
        finalChatRoomData.participant1._id.toString() === senderId.toString();

      // Sender gets receiver's data
      const senderData = {
        partnerId: receiverId.toString(),
        name: isSenderParticipant1
          ? finalChatRoomData.participant2?.name
          : finalChatRoomData.participant1?.name,
        image: isSenderParticipant1
          ? finalChatRoomData.participant2?.image
          : finalChatRoomData.participant1?.image,

        model: chatData.receiverModel,
        lastMsg: finalChatRoomData.lastMessage || 'send an image',
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

        model: chatData.senderModel,
        lastMsg: finalChatRoomData.lastMessage || 'send an image',
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

  const chat = new Chat({ ...chatData, seenBy: [chatData.senderId] });
  if (chatData && isReceiverExist.fcmToken) {
    const message = {
      token: isReceiverExist.fcmToken, // Device FCM Token
      notification: {
        title: `New Image from  ${isSenderExist.name}`, // Title of the notification
        body: 'New Image', // Message
      },
      data: {
        extraData: `${chatData.message}`,
      },
    };

    await admin.messaging().send(message);
  }

  return await chat.save();
};

const getAllChats = async (payload: any, query: Record<string, any>) => {
  if (!payload.sender || !payload.receiver) {
    throw new AppError(400, 'Sender and receiver are required.');
  }
  if (payload.sender === payload.receiver) {
    throw new AppError(400, 'Sender and receiver cannot be the same.');
  }

  const chatQuery = new QueryBuilder(
    Chat.find({
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
    }),
    query
  )
    // .search(['message'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await chatQuery.modelQuery;

  const meta = await chatQuery.countTotal();
  return { result, meta };
};

const chatList = async (userId: string) => {
  // Get all chat rooms where the user is a participant
  const chatRooms = (await ChatRoom.find({
    $or: [{ participant1: userId }, { participant2: userId }],
  })
    .populate('participant1', 'name image role')
    .populate('participant2', 'name image role')
    .sort({ lastMessageTime: -1 })
    .lean()) as any;
  // Format the chat list to return
  const formattedChatList = chatRooms.map((room: any) => {
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
      unreadCount: room.seenBy?.includes(userId) ? 0 : 1, // Basic unread counter
    };
  });
  return formattedChatList;
};

export const ChatServices = {
  createChat,
  createChatWithImage,
  getAllChats,
  chatList,
};
