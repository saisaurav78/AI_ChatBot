import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Assuming you have a User model defined
dotenv.config();
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

// Login Function
export const login = async (req, res) => {
  const { username, password } = req.body;

  // Validate credentials 
 if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Account does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token valid for 1 hour
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    // Set HTTP-only cookie with token (secure and sameSite adjusted for env)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour in ms
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ message: 'Login Successful' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(401).json({ message: 'An error occurred during login' });
  }
};


export const register = async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful! Please login.' });
  } catch (error) {
    console.error('Error in registration:', error);
    return res.status(500).json({ message: 'An error occurred during registration' });
  }
};