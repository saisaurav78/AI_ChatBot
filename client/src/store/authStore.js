import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * MobX store managing authentication state:
 *  user info
 *  loading and error states
 *  login, logout, and fetch user data async functions
 */
class AuthStore {
  user = null;
  error = null;
  isAuthenticated = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Sets loading state
  setLoading = (loading) => {
    this.loading = loading;
  };

  /**
   * Logs in user with username and password.
   * On success, fetches user data and clears errors.
   * On failure, sets error message and resets auth state.
   */
  login = async (username, password) => {
    this.setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        { username, password },
        { withCredentials: true },
      );

      if (response.status === 200) {
        await this.fetchUser();
        runInAction(() => {
          this.error = null;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Login failed';
        this.user = null;
        this.isAuthenticated = false;
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  /**
   * Fetches current logged-in user data.
   * Updates user info, auth status, and clears errors if successful.
   * Resets auth state on failure or no user data.
   */
  fetchUser = async () => {
    this.setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/auth/user`, {
        withCredentials: true,
      });

      runInAction(() => {
        if (response.status === 200 && response.data?.user) {
          this.user = response.data.user;
          this.isAuthenticated = true;
          this.error = null;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  /**
   * Logs out the user by calling API and clearing local auth state.
   * Logs error if logout API fails.
   */
  logout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
        this.error = null;
      });
    }
  };
}

export default new AuthStore();
