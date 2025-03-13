import { Notification } from './notification.model';

const createNotification = async (payload: { body: string; user: string }) => {
  if (!payload.body || !payload.user) {
    throw new Error('Body and user are required');
  }
  const result = await Notification.create(payload);
};

const getUserNotification = async (userId: string) => {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const NotificationService = {
  createNotification,
  getUserNotification,
};
