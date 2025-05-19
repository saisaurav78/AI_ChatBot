import { Router } from "express";
import { chatController } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
router.post('/', verifyToken, chatController);

export default router;