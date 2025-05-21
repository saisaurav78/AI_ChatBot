import express from 'express';
import { login } from '../controllers/userController.js';
import { logout, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /login - User login endpoint
router.post('/login', login);

// GET /user - Protected route to get authenticated user's info, verifyToken middleware ensures the request is authenticated
router.get('/user', verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

// POST /logout - User logout endpoint
router.post('/logout', logout);

export default router;
