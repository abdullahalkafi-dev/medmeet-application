import { Router } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { ChatController } from './chat.controller';

const router = Router();

router.post(
  '/chat',
  fileUploadHandler,
  auth(),
  ChatController.createChatWithImage
);

router.post('/',  ChatController.getAllChats);
router.get('/chat/:userId', ChatController.chatList);

export const ChatRoutes = router;
