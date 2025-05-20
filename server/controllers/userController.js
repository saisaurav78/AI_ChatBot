import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

// Dummy credentials
const USERNAME = 'user';
const PASSWORD = 'user123';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = (req, res) => {
    const { username, password } = req.body;
    if(username === USERNAME && password === PASSWORD) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", secure: process.env.NODE_ENV === 'production' });
        return res.status(200).json({ message: 'Login Successful' });
    }
    else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

};
