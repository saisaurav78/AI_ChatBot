import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const MONGO_URI = process.env.MONGO_URI; // MongoDB connection string from environment variables

// Function to connect to MongoDB using Mongoose
const DBconnect = async () => {
  try {
    // Connect to MongoDB with specified database name
    await mongoose.connect(MONGO_URI, { dbName: 'AI_Chat' });

    // Optionally reuse the same DB instance (not mandatory here, but useful in multi-DB setups)
    const db = mongoose.connection.useDb('AI_Chat');

    console.log('connected to db');
  } catch (error) {
    // Log any connection errors
    console.error(error);
  }
};

export default DBconnect; // Export the connection function for use in server setup
