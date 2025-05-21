import { Router } from 'express';
import { sendMessage, getChatHistory, upload } from '../controllers/chatController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// GET / - Protected route to fetch the authenticated user's chat history
router.get('/', verifyToken, getChatHistory);

// POST / - Protected route to send a message or upload a file
router.post('/', verifyToken, upload.single('file'), sendMessage);

export default router;
