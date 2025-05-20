import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
import chatModel from '../models/chatModel.js';
import faqModel from '../models/faqModel.js';
import multer from 'multer';
import fs from 'fs';


dotenv.config();

const endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
const apiKey = process.env['AZURE_OPENAI_API_KEY'];
const apiVersion = '2025-01-01-preview';
const deployment = 'gpt-35-turbo';
const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

export const upload = multer({ storage });


export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;
    const username = req.user?.username || 'user';

    if (!message && !file) {
      return res.status(400).json({ error: 'Either message or file must be provided' });
    }

    if (file) {
      const filePath = path.join(uploadDir, file.filename);
      console.log('Reading file from:', filePath);
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Uploaded file not found on server' });
      }

      let fileText = '';

      if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        fileText = pdfData.text;
      } else if (file.mimetype === 'text/plain') {
        fileText = fs.readFileSync(filePath, 'utf-8');
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      // Save file content in FAQ DB
      await faqModel.create({
        title: file.originalname,
        content: fileText,
        uploadedBy: username,
      });

      // Send success message response, no AI chat call
      return res.json({
        message: `File '${file.originalname}' uploaded successfully.`,
      });
    }

    // If no file, handle user message with AI response
    const userFaqDocs = await faqModel.find({ uploadedBy: username });
    const companyDataContext = userFaqDocs.length
      ? userFaqDocs.map((doc) => doc.content).join('\n---\n')
      : '';

    const systemPrompt = companyDataContext
      ? `You are a helpful support agent. Use the following company data to answer questions:\n${companyDataContext}`
      : `You are a helpful support agent. Answer the user's questions as best you can.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message || '' },
    ];

    const result = await client.chat.completions.create({
      messages,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const AI_Message = result.choices[0].message.content;

    // Save chat history
    let existingChat = await chatModel.findOne({ user: username });

    if (existingChat) {
      if (message && message.trim() !== '') {
        existingChat.messages.push({ role: 'user', content: message });
      }
      existingChat.messages.push({ role: 'assistant', content: AI_Message });
      await existingChat.save();
    } else {
      const initialMessages = [];
      if (message && message.trim() !== '') {
        initialMessages.push({ role: 'user', content: message });
      }
      initialMessages.push({ role: 'assistant', content: AI_Message });
      await chatModel.create({
        user: username,
        messages: initialMessages,
      });
    }

    res.json({
      message: AI_Message,
    });
  } catch (error) {
    console.error('Error occurred while processing chat request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const username = req.user?.username || 'user';
    const chatHistory = await chatModel.findOne({ user: username });

    if (!chatHistory) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: chatHistory.messages });
  } catch (error) {
    console.error('Error occurred while fetching chat history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
