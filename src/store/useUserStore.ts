import { create } from 'zustand';
import CONSTANTS from '../utils/constants';
import api from '../utils/api';
import ApiURL from '../utils/apiurl';

export interface IAuthenticatedUser {
  token: string | null;
  email: string | null;
}


export interface IUseUserStore {

  authenticatedUser: IAuthenticatedUser;
  // eslint-disable-next-line no-unused-vars
  setAuthenticatedUser: (authenticatedUser: IAuthenticatedUser) => void;
  removeAuthenticatedUser: () => void;

  getOnboardingFlag: () => boolean;
  setOnboardingFlag: () => void;

  // eslint-disable-next-line no-unused-vars
  login: (_email: string, _password: string) => void;
  loginLoading: boolean;
  loginError: string | null;
}


export const useUserStore = create<IUseUserStore>(set => ({
  authenticatedUser: {
    token: null,
    email: null,
  },
  setAuthenticatedUser: (authenticatedUser: IAuthenticatedUser) => {
    try {
      localStorage.setItem(
        CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY,
        JSON.stringify(authenticatedUser)
      );
      return set({ authenticatedUser: authenticatedUser });
    } catch (error) {
      console.error('Error setting authenticated user in localStorage', error);
    }
  },
  removeAuthenticatedUser: () => {
    try {
      localStorage.removeItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY);
      set({
        authenticatedUser: {
          token: null,
          email: null,
        },
      });
    } catch (error) {
      console.error('Error removing authenticated user from localStorage', error);
    }
  },

  getOnboardingFlag: () => {
    if (localStorage.getItem(CONSTANTS.ONBOARDING_FLAG_STORAGE_KEY) === 'present') {
      return false;
    } else {
      return true;
    }
  },
  setOnboardingFlag: () => {
    localStorage.setItem(CONSTANTS.ONBOARDING_FLAG_STORAGE_KEY, 'present');
  },

  loginLoading: false,
  loginError: null,
  login: async (_email: string, _password: string) => {
    set({ loginError: null, loginLoading: true });
    try {
      const res: any = await api.post(ApiURL.auth.signin, { email: _email, password: _password });
      const authenticatedUser = { token: res.data.access_token, email: _email };
      localStorage.setItem(
        CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY,
        JSON.stringify(authenticatedUser)
      );
      set({ authenticatedUser: authenticatedUser, loginLoading: false });
    } catch {
      set({ loginError: 'Invalid Credential', loginLoading: false });
    }
  },
}));
