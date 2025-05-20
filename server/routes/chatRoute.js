import { Router } from "express";
import { sendMessage, getChatHistory, upload } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
// Route to handle chat requests

router.get('/', verifyToken, getChatHistory);

router.post('/', verifyToken, upload.single('file'), sendMessage);

export default router;