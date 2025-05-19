import express from 'express';
import { login } from '../controllers/userController.js';
import { logout, verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);

router.get('/user', verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post('/logout',  logout);

export default router;
