import { Schema, model } from 'mongoose';

const chatSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel', // Dynamic reference
    },
    receiverId: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

// Custom validator to ensure either message or file is present
chatSchema.pre('validate', function (next) {
  if (!this.message && !this.file) {
    this.invalidate('message', 'Either message or file is required');
  }
  next();
});

const chatRoomSchema = new Schema(
  {
    participant1: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel', // Dynamic reference
    },
    participant2: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const Chat = model('Chat', chatSchema); 
export const ChatRoom = model('ChatRoom', chatRoomSchema);


export default Chat;
