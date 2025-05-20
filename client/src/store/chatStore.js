import axios from 'axios';
import { makeAutoObservable } from 'mobx';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class ChatStore {
  messages = [];
  typing = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadChat = async () => {
    this.loading = true;
    try {
      const res = await axios.get(`${BASE_URL}/chat`, { withCredentials: true });
      this.messages = res.data.messages.map((msg) => ({
        sender: msg.role === 'user' ? 'user' : 'AI',
        text: msg.content,
        time: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
    } catch (error) {
      console.error('Failed to load chat:', error);
    } finally {
      this.loading = false;
    }
  };

  sendMessage = async ({ content, file }) => {
    this.addMessage({ sender: 'user', text: content || (file ? file.name : '') });

    this.setTyping(true);

    try {
      const formData = new FormData();
      if (content) formData.append('message', content);
      if (file) formData.append('file', file);

      const res = await axios.post(`${BASE_URL}/chat`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const AI_message = res.data?.message || 'Sorry, no response.';

      this.addMessage({
        sender: 'AI',
        text: AI_message,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      this.addMessage({ sender: 'AI', text: 'Sorry, something went wrong.' });
    } finally {
      this.setTyping(false);
    }
  };

  addMessage = (msg) => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    this.messages = [...this.messages, { ...msg, time }];
  };

  setTyping = (status) => {
    this.typing = status;
  };

  clearMessages = () => {
    this.messages = [];
  };
}

const chatStore = new ChatStore();
export default chatStore;
