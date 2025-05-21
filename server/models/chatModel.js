import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true, // Identifier for the user owning this chat
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'], // Role of the message sender
          required: true,
        },
        content: {
          type: String,
          required: true, // Text content of the message
        },
        timestamp: {
          type: Date,
          default: Date.now, // Time when the message was created
        },
      },
    ],
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);

export default mongoose.model('Chat', chatSchema);
