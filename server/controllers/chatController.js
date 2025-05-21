import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
import chatModel from '../models/chatModel.js';
import faqModel from '../models/faqModel.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

dotenv.config();

// Azure OpenAI client setup with environment variables
const endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
const apiKey = process.env['AZURE_OPENAI_API_KEY'];
const apiVersion = '2025-01-01-preview';
const deployment = process.env['AZURE_DEPLOYMENT_NAME']
const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

// Setup multer storage for file uploads
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
});

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;
    const username = req.user?.username || 'user';

    // Validate input: must have either a message or a file
    if ((!message || typeof message !== 'string' || message.trim() === '') && !file) {
      return res.status(400).json({ error: 'Either a valid message or file must be provided' });
    }

    if (file) {
      const filePath = path.join(uploadDir, file.filename);

      // Check if uploaded file exists
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Uploaded file not found on server' });
      }

      let fileText = '';

      // Extract text from PDF or plain text files
      if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        fileText = pdfData.text;
      } else if (file.mimetype === 'text/plain') {
        fileText = fs.readFileSync(filePath, 'utf-8');
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      // Save extracted content into FAQ collection
      await faqModel.create({
        title: file.originalname,
        content: fileText,
        uploadedBy: username,
      });

      // Attempt to delete the uploaded file after processing
      try {
        fs.unlinkSync(filePath);
      } catch (delErr) {
        console.warn('Failed to delete uploaded file:', delErr.message);
      }

      return res.json({
        message: `File '${file.originalname}' uploaded successfully.`,
      });
    }

    // If no file, proceed with AI chat interaction

    // Fetch all FAQs uploaded by this user to use as context
    const userFaqDocs = await faqModel.find({ uploadedBy: username });

    const companyDataContext = userFaqDocs.length
      ? userFaqDocs.map((doc) => doc.content).join('\n---\n')
      : '';

    // System prompt conditionally includes company FAQ data as context
    const systemPrompt = companyDataContext
      ? `You are a helpful support agent. Use the following company data to answer questions:\n${companyDataContext}`
      : `You are a helpful support agent. Answer the user's questions as best you can.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ];

    // Call Azure OpenAI chat completions API
    const result = await client.chat.completions.create({
      messages,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const AI_Message = result.choices?.[0]?.message?.content?.trim() || 'No response generated.';

    // Save chat messages to database for persistence
    let existingChat = await chatModel.findOne({ user: username });

    if (existingChat) {
      if (message.trim() !== '') {
        existingChat.messages.push({ role: 'user', content: message });
      }
      existingChat.messages.push({ role: 'assistant', content: AI_Message });
      await existingChat.save();
    } else {
      const initialMessages = [];
      if (message.trim() !== '') {
        initialMessages.push({ role: 'user', content: message });
      }
      initialMessages.push({ role: 'assistant', content: AI_Message });
      await chatModel.create({
        user: username,
        messages: initialMessages,
      });
    }

    res.json({ message: AI_Message });
  } catch (error) {
    console.error('Error occurred while processing chat request:', error);
    res.status(500).json({
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const username = req.user?.username || 'user';

    // Fetch stored chat history for the user
    const chatHistory = await chatModel.findOne({ user: username });

    if (!chatHistory) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: chatHistory.messages });
  } catch (error) {
    console.error('Error occurred while fetching chat history:', error);
    res.status(500).json({
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
    });
  }
};
