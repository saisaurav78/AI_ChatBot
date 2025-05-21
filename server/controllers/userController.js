import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();


// Dummy Credentials
const USERNAME = 'user';
const PASSWORD = 'user123';
const JWT_SECRET = process.env.JWT_SECRET;

// Login Function
export const login = (req, res) => {
  const { username, password } = req.body;

  // Validate credentials (dummy check)
  if (username === USERNAME && password === PASSWORD) {
    
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
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};
