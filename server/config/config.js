import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const DBconnect = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'AI_Chat' });
    const db = mongoose.connection.useDb('AI_Chat');
    console.log('connected to db');
  } catch (error) {
    console.error(error);
  }
};

export default DBconnect;
