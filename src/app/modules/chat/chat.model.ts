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

const Chat = model('Chat', chatSchema);

export default Chat;
