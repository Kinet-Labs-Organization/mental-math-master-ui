import { create } from "zustand";
import CONSTANTS from "../utils/constants";
import api from "../utils/api";
import ApiURL from "../utils/apiurl";

export interface IAuthenticatedUser {
  token: string | null;
  email: string | null;
  name: string | null;
}

export const useUserStore = create<any>((set) => ({
  authenticatedUser: {
    token: null,
    email: null,
    name: null,
  },

  setAuthenticatedUser: (authenticatedUser: IAuthenticatedUser) => {
    try {
      localStorage.setItem(
        CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY,
        JSON.stringify(authenticatedUser),
      );
      return set({ authenticatedUser: authenticatedUser });
    } catch (error) {
      console.error("Error setting authenticated user in localStorage", error);
    }
  },

  removeAuthenticatedUser: () => {
    try {
      localStorage.removeItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY);
      set({
        authenticatedUser: {
          token: null,
          email: null,
          name: null,
        },
      });
    } catch (error) {
      console.error(
        "Error removing authenticated user from localStorage",
        error,
      );
    }
  },

  getOnboardingFlag: () => {
    if (
      localStorage.getItem(CONSTANTS.ONBOARDING_FLAG_STORAGE_KEY) === "present"
    ) {
      return false;
    } else {
      return true;
    }
  },

  setOnboardingFlag: () => {
    localStorage.setItem(CONSTANTS.ONBOARDING_FLAG_STORAGE_KEY, "present");
  },

  loginLoading: false,
  loginError: null,

  login: async (_email: string, _password: string) => {
    set({ loginError: null, loginLoading: true });
    try {
      const res: any = await api.post(ApiURL.auth.signin, {
        email: _email,
        password: _password,
      });
      const authenticatedUser = { token: res.data.access_token, email: _email, name: res.data.name };
      localStorage.setItem(
        CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY,
        JSON.stringify(authenticatedUser),
      );
      set({ authenticatedUser: authenticatedUser, loginLoading: false });
    } catch {
      set({ loginError: "Invalid Credential", loginLoading: false });
    }
  },

  settingsData: null,
  settingsDataLoading: false,
  settingsDataError: null,
  fetchSettingsData: async () => {
    try {
      set({ settingsDataLoading: true });
      const res: any = await api.get(ApiURL.user.settingsData);
      set({ settingsData: res.data, settingsDataLoading: false });
    } catch (error) {
      set({ settingsDataError: error, settingsDataLoading: false });
    }
  },
  updateSettingsData: async (settings: { name: string, value: string }) => {
    try {
      set({ settingsDataLoading: true });
      const res: any = await api.post(ApiURL.user.updateSettings, settings);
      set({ settingsData: res.data, settingsDataLoading: false });
    } catch (error) {
      set({ settingsDataError: error, settingsDataLoading: false });
    }
  },

  notifications: null,
  notificationsLoading: false,
  notificationsError: null,
  fetchNotifications: async (recentMax: number) => {
    set({ notificationsLoading: true, notificationsError: null });
    try {
      const result = await api.get(ApiURL.user.fetchNotifications, { params: { recentMax } });
      return set({ notifications: result.data, notificationsLoading: false });
    } catch (error) {
      return set({
        notificationsLoading: false,
        notificationsError: "Failed to fetch notifications",
      });
    }
  },

  profile: null,
  profileLoading: false,
  profileError: null,
  fetchProfile: async () => {
    set({ profileLoading: true, profileError: null });
    try {
      const result = await api.get(ApiURL.user.fetchProfile);
      return set({ profile: result.data, profileLoading: false });
    } catch (error) {
      return set({
        profileLoading: false,
        profileError: "Failed to fetch profile",
      });
    }
  },

}));
