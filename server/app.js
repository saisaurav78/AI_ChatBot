import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DBconnect from './config/config.js';
import chatRoute from './routes/chatRoute.js';
import userRoute from './routes/userRoute.js';
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();


app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend origin
    credentials: true, // allow cookies and credentials
  }),
);
app.use(express.json());

DBconnect();

app.use('/api/auth', userRoute);
app.use('/api/chat', chatRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})