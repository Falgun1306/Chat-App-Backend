import express from 'express'
import { getMessages, sendMessage } from '../Controller/message.controller.js';
import { isAuthenticated } from '../Middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send/:receiverId',isAuthenticated, sendMessage);
router.get('/get-messages/:otherParticipantsId', isAuthenticated, getMessages);

export default router;