import axios from 'axios';
import { makeAutoObservable } from 'mobx';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class AuthStore {
  user = null;
  error = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
  }

  login = async (username, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        { username, password },
        { withCredentials: true },
      );

      if (response.status === 200) {
        await this.fetchUser();
        this.error = null;
      }
    } catch (error) {
      this.error = error.response?.data?.message || 'Login failed';
      this.user = null;
      this.isAuthenticated = false;
    }
  };

  fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/user`, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data?.user) {
        this.user = response.data.user;
        this.isAuthenticated = true;
        this.error = null;
      } else {
        this.user = null;
        this.isAuthenticated = false;
      }
    } catch (error) {
      this.user = null;
      this.isAuthenticated = false;
      this.error = 'Failed to fetch user';
    }
  };

  logout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
    }
  };
}

export default new AuthStore();
