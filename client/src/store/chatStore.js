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
        this.messages = res.data.messages.map((msg) => ({
          sender: msg.role === 'user' ? 'user' : 'AI',
          text: msg.content,
          time: this.formatMessageTime(msg.timestamp),
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
    // Add user message locally including file if present
    this.addMessage({ sender: 'user', text: content || '', file: file || null });
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

      runInAction(() => {
        this.addMessage({ sender: 'AI', text: AI_message });
      });
    } catch (error) {
      console.error('Error sending message:', error);
      runInAction(() => {
        this.addMessage({ sender: 'AI', text: 'Sorry, something went wrong.' });
      });
    } finally {
      runInAction(() => {
        this.setTyping(false);
      });
    }
  };

  addMessage = (msg) => {
    // Add timestamp and append message to list
    const time = this.formatMessageTime(new Date().toISOString());
    this.messages = [...this.messages, { ...msg, time }];
  };

  setTyping = (status) => {
    this.typing = status; // Update typing status
  };

  clearMessages = () => {
    this.messages = []; // Clear all messages
  };

  // Returns a formatted date and time label from a timestamp
  formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const dateMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const nowMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    const diffDays = Math.floor((nowMidnight - dateMidnight) / (1000 * 60 * 60 * 24));

    let timeLabel;
    if (diffDays === 0) {
      timeLabel = 'Today';
    } else if (diffDays === 1) {
      timeLabel = 'Yesterday';
    } else {
      timeLabel = date.toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }

    return `${timeLabel}, ${date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  };
}

const chatStore = new ChatStore();
export default chatStore;
