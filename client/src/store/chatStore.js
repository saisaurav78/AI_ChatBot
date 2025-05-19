import axios from 'axios';
import { makeAutoObservable } from 'mobx';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class ChatStore {
  messages = [];
  typing = false;

  constructor() {
    makeAutoObservable(this);
  }

  sendMessage = async (text) => {
    this.addMessage({ sender: 'user', text });
    this.setTyping(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/chat`,
        { message: text },
        { withCredentials: true },
      );

      const AI_message = res.data?.message || 'Sorry, no response.';
      this.addMessage({ sender: 'AI', text: AI_message });
    } catch (error) {
      console.error('Error occurred while sending chat message:', error);
      this.addMessage({ sender: 'AI', text: 'Sorry, something went wrong.' });
    } finally {
      this.setTyping(false);
    }
  };

  addMessage = (msg) => {
    // Ensures reactive update
    this.messages = [...this.messages, msg];
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
