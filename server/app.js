import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DBconnect from './config/config.js';
import chatRoute from './routes/chatRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config(); // Load environment variables from .env file

app.use(cookieParser()); // Parse cookies from incoming requests

// Serve static files from uploads directory for access to uploaded files
app.use('/uploads', express.static('uploads'));

// Enable CORS for frontend origin with credentials support (cookies, auth headers)
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  }),
);

app.use(express.json()); // Parse JSON bodies in requests

DBconnect(); // Connect to MongoDB database

// Routes for authentication (login/logout/user info)
app.use('/api/auth', userRoute);

// Routes for chat features (send messages, get history)
app.use('/api/chat', chatRoute);

// Simple test route to check if server is up
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
