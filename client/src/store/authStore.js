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
  loading = true;
  authLoading = false; // authLoading is used to track loading state during auth operations
  successMessage = null; // Used for displaying messages to the user

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
    this.authLoading = true;
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
        this.authLoading = false;
      });
    }
  };

   register = async (username, password, confirmPassword) => {
    this.authLoading = true;
    this.error = null;
    this.successMessage = null;

    if (!username || !password) {
      runInAction(() => {
        this.error = 'Username and password are required';
        this.authLoading = false;
      });
      return;
    }
    if (password !== confirmPassword) {
      runInAction(() => {
        this.error = 'Passwords do not match';
        this.authLoading = false;
      });
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/register`,
        { username, password },
        { withCredentials: true },
      );

      if (response.status === 201) {
        runInAction(() => {
          this.successMessage = 'Registration successful! Please login.';
          this.error = null;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Registration failed';
        this.authLoading = false;
      });
    } finally {
      runInAction(() => {
        this.authLoading = false;
      });
    }
  }

  /**
   * Fetches current logged-in user data.
   * Updates user info, auth status, and clears errors if successful.
   * Resets auth state on failure or no user data.
   */
  fetchUser = async () => {
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
          this.error = null;
        }
      });
    } catch (error) {
      runInAction(() => {
        if (error.response?.status === 401) {
          this.user = null;
          this.isAuthenticated = false;
          this.error = null;
        } else if (error.response?.status === 403) {
          this.user = null;
          this.isAuthenticated = false;
          this.error = 'Session expired. Please log in again.';
        } else {
          this.user = null;
          this.isAuthenticated = false;
          this.error = 'Failed to fetch user session. Please try again later.';
        }
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
