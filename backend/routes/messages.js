import express from 'express';
import { getMessages, markAsRead, sendMessage } from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:conversationId', verifyToken, getMessages);
router.post('/read', verifyToken, markAsRead);
router.post('/send', verifyToken, sendMessage);

export default router;
