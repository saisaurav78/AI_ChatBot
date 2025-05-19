import mongoose from 'mongoose';
const chatSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  messages: [
    {
      role: String, 
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model('Chat', chatSchema, 'chat');
