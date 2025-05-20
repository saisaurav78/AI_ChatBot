import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('Chat', chatSchema);
