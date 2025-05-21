import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class ChatStore {
  messages = [];
  typing = false;
  loading = false;

  constructor() {
    makeAutoObservable(this); // MobX reactive state
  }

  loadChat = async () => {
    runInAction(() => {
      this.loading = true; // Start loading indicator
    });

    try {
      const res = await axios.get(`${BASE_URL}/chat`, { withCredentials: true });

      runInAction(() => {
        // Map API response to message objects
        this.messages = res.data.messages.map((msg) => ({
          sender: msg.role === 'user' ? 'user' : 'AI',
          text: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
      });
    } catch (error) {
      console.error('Failed to load chat:', error);
    } finally {
      runInAction(() => {
        this.loading = false; // Stop loading indicator
      });
    }
  };

  sendMessage = async ({ content, file }) => {
    this.addMessage({ sender: 'user', text: content || (file ? file.name : '') }); // Add user message locally
    this.setTyping(true); // Show typing indicator

    try {
      const formData = new FormData();
      if (content) formData.append('message', content);
      if (file) formData.append('file', file);

      const res = await axios.post(`${BASE_URL}/chat`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const AI_message = res.data?.message || 'Sorry, no response.';

      runInAction(() => {
        this.addMessage({ sender: 'AI', text: AI_message }); // Add AI response
      });
    } catch (error) {
      console.error('Error sending message:', error);
      runInAction(() => {
        this.addMessage({ sender: 'AI', text: 'Sorry, something went wrong.' });
      });
    } finally {
      runInAction(() => {
        this.setTyping(false); // Hide typing indicator
      });
    }
  };

  addMessage = (msg) => {
    // Add timestamp and append message to list
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    this.messages = [...this.messages, { ...msg, time }];
  };

  setTyping = (status) => {
    this.typing = status; // Update typing status
  };

  clearMessages = () => {
    this.messages = []; // Clear all messages
  };
}

const chatStore = new ChatStore();
export default chatStore;
