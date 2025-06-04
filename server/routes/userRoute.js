import express from 'express';
import { login,register } from '../controllers/userController.js';
import { logout, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /login - User login endpoint
router.post('/login', login);

// POST /register - User registration endpoint
router.post('/register', register);

// GET /user - Protected route to get authenticated user's info, verifyToken middleware ensures the request is authenticated
router.get('/user', verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

// POST /logout - User logout endpoint
router.post('/logout', logout);

export default router;
