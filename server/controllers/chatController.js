import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
import chatModel from '../models/chatModel.js';
dotenv.config();

const endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
const apiKey = process.env['AZURE_OPENAI_API_KEY'];
const apiVersion = '2025-01-01-preview';
const deployment = 'gpt-35-turbo';
const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export const chatController = async (req, res) => {
  try {
      const { message } = req.body;
    const result = await client.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null,
    });
      
      const AI_Message = result.choices[0].message.content;
  
      await chatModel.create({
          user: req.user.username || 'user',
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: AI_Message }
          ]
      })

    res.json({ message: AI_Message });
  } catch (error) {
    console.error('Error occurred while processing chat request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
