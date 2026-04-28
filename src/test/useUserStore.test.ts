import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserStore } from '../store/useUserStore';
import api from '../utils/api';
import ApiURL from '../utils/apiurl';
import CONSTANTS from '../utils/constants';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('useUserStore', () => {
  const mockedApi = vi.mocked(api, true);

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.clearAllMocks();
    useUserStore.setState({
      authenticatedUser: {
        token: null,
        email: null,
        name: null,
        avatar: null,
      },
      notifications: null,
      notificationsLoading: false,
      notificationsError: null,
      profile: null,
      profileLoading: false,
      profileError: null,
      achievements: null,
      achievementsLoading: false,
      achievementsError: null,
      loginLoading: false,
      loginError: null,
      settingsData: null,
      settingsDataLoading: false,
      settingsDataError: null,
    });
  });

  it('stores authenticated user in localStorage and state', () => {
    const user = { token: 'abc', email: 'test@example.com', name: 'Test User', avatar: 'avatar.png' };

    useUserStore.getState().setAuthenticatedUser(user);

    expect(JSON.parse(localStorage.getItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY)!)).toEqual(user);
    expect(useUserStore.getState().authenticatedUser).toEqual(user);
  });

  it('logs storage errors when setting authenticated user fails', () => {
    const error = new Error('Storage unavailable');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw error;
    });
    const initialUser = useUserStore.getState().authenticatedUser;

    useUserStore.getState().setAuthenticatedUser({
      token: 'abc',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'avatar.png',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error setting authenticated user in localStorage',
      error
    );
    expect(useUserStore.getState().authenticatedUser).toEqual(initialUser);
  });

  it('removes authenticated user from localStorage and resets state', () => {
    const user = { token: 'abc', email: 'test@example.com', name: 'Test User', avatar: 'avatar.png' };
    useUserStore.getState().setAuthenticatedUser(user);

    useUserStore.getState().removeAuthenticatedUser();

    expect(localStorage.getItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY)).toBeNull();
    expect(useUserStore.getState().authenticatedUser.token).toBeNull();
    expect(useUserStore.getState().authenticatedUser.email).toBeNull();
    expect(useUserStore.getState().authenticatedUser.name).toBeNull();
  });

  it('logs storage errors when removing authenticated user fails', () => {
    const error = new Error('Storage unavailable');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw error;
    });

    useUserStore.getState().removeAuthenticatedUser();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error removing authenticated user from localStorage',
      error
    );
  });

  it('returns true for onboarding flag when not present', () => {
    localStorage.removeItem(CONSTANTS.ONBOARDING_FLAG_STORAGE_KEY);

    expect(useUserStore.getState().getOnboardingFlag()).toBe(true);
  });

  it('returns false for onboarding flag once set', () => {
    useUserStore.getState().setOnboardingFlag();

    expect(useUserStore.getState().getOnboardingFlag()).toBe(false);
  });

  it('fetches notifications successfully', async () => {
    const responses = [{ id: 1, title: 'Hello' }];
    mockedApi.get.mockResolvedValue({ data: responses });

    await useUserStore.getState().fetchNotifications(10);

    expect(mockedApi.get).toHaveBeenCalledWith(expect.any(String), { params: { recentMax: 10 } });
    expect(useUserStore.getState().notifications).toEqual(responses);
    expect(useUserStore.getState().notificationsLoading).toBe(false);
    expect(useUserStore.getState().notificationsError).toBeNull();
  });

  it('handles notification fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await useUserStore.getState().fetchNotifications(5);

    expect(useUserStore.getState().notificationsLoading).toBe(false);
    expect(useUserStore.getState().notificationsError).toBe('Failed to fetch notifications');
  });

  it('returns false for paywall flag once set', () => {
    useUserStore.getState().setOnboardingPaywallFlag();

    expect(useUserStore.getState().getOnboardingPaywallFlag()).toBe(false);
  });

  it('returns true for paywall flag when not present', () => {
    localStorage.removeItem(CONSTANTS.PAYWALL_FLAG_STORAGE_KEY);

    expect(useUserStore.getState().getOnboardingPaywallFlag()).toBe(true);
  });

  it('logs in successfully and stores authenticated user', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const response = { data: { access_token: 'token123', name: 'Test User' } };
    mockedApi.post.mockResolvedValue(response);

    await useUserStore.getState().login(email, password);

    expect(mockedApi.post).toHaveBeenCalledWith(ApiURL.auth.signin, {
      email,
      password,
    });
    expect(useUserStore.getState().authenticatedUser).toEqual({
      token: 'token123',
      email,
      name: 'Test User',
    });
    expect(useUserStore.getState().loginLoading).toBe(false);
    expect(useUserStore.getState().loginError).toBeNull();
  });

  it('handles login failure', async () => {
    mockedApi.post.mockRejectedValue(new Error('Invalid credentials'));

    await useUserStore.getState().login('test@example.com', 'wrong');

    expect(useUserStore.getState().loginLoading).toBe(false);
    expect(useUserStore.getState().loginError).toBe('Invalid Credential');
  });

  it('fetches settings data successfully', async () => {
    const settingsData = { theme: 'dark' };
    mockedApi.get.mockResolvedValue({ data: settingsData });

    await useUserStore.getState().fetchSettingsData();

    expect(mockedApi.get).toHaveBeenCalledWith(ApiURL.user.settingsData);
    expect(useUserStore.getState().settingsData).toEqual(settingsData);
    expect(useUserStore.getState().settingsDataLoading).toBe(false);
    expect(useUserStore.getState().settingsDataError).toBeNull();
  });

  it('handles settings fetch failure', async () => {
    const error = new Error('Fetch failed');
    mockedApi.get.mockRejectedValue(error);

    await useUserStore.getState().fetchSettingsData();

    expect(useUserStore.getState().settingsDataLoading).toBe(false);
    expect(useUserStore.getState().settingsDataError).toBe(error);
  });

  it('updates settings data successfully', async () => {
    const updatedSettings = { name: 'language', value: 'en' };
    const response = { data: { language: 'en' } };
    mockedApi.post.mockResolvedValue(response);

    await useUserStore.getState().updateSettingsData(updatedSettings);

    expect(mockedApi.post).toHaveBeenCalledWith(ApiURL.user.updateSettings, updatedSettings);
    expect(useUserStore.getState().settingsData).toEqual(response.data);
    expect(useUserStore.getState().settingsDataLoading).toBe(false);
    expect(useUserStore.getState().settingsDataError).toBeNull();
  });

  it('handles settings update failure', async () => {
    mockedApi.post.mockRejectedValue(new Error('Update failed'));

    await useUserStore.getState().updateSettingsData({ name: 'language', value: 'en' });

    expect(useUserStore.getState().settingsDataLoading).toBe(false);
    expect(useUserStore.getState().settingsDataError).toBeInstanceOf(Error);
  });

  it('marks a notification as read without throwing', async () => {
    mockedApi.post.mockResolvedValue({});

    await expect(useUserStore.getState().markNotificationRead(123)).resolves.toBeUndefined();
    expect(mockedApi.post).toHaveBeenCalledWith(ApiURL.user.markNotificationRead, { notificationId: 123 });
  });

  it('logs notification read failures without throwing', async () => {
    const error = new Error('Mark failed');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mockedApi.post.mockRejectedValue(error);

    await expect(useUserStore.getState().markNotificationRead(123)).resolves.toBeUndefined();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to mark notification as read', error);
  });

  it('fetches profile successfully', async () => {
    const profile = { plan: { planId: 'PRO' }, displayName: 'Test User' };
    mockedApi.get.mockResolvedValue({ data: profile });

    await useUserStore.getState().fetchProfile();

    expect(mockedApi.get).toHaveBeenCalledWith(ApiURL.user.fetchProfile);
    expect(useUserStore.getState().profile).toEqual(profile);
    expect(useUserStore.getState().profileLoading).toBe(false);
    expect(useUserStore.getState().profileError).toBeNull();
  });

  it('handles profile fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Profile failed'));

    await useUserStore.getState().fetchProfile();

    expect(useUserStore.getState().profileLoading).toBe(false);
    expect(useUserStore.getState().profileError).toBe('Failed to fetch profile');
  });

  it('sets profile loading flags while fetching profile', () => {
    let resolveRequest: (value: { data: any }) => void = () => undefined;
    mockedApi.get.mockReturnValue(
      new Promise(resolve => {
        resolveRequest = resolve;
      }) as any
    );

    const request = useUserStore.getState().fetchProfile();

    expect(useUserStore.getState().profileLoading).toBe(true);
    expect(useUserStore.getState().profileError).toBeNull();

    resolveRequest({ data: { id: 'profile-1' } });
    return request;
  });

  it('fetches achievements successfully', async () => {
    const achievements = [{ id: 1, name: 'First Win' }];
    mockedApi.get.mockResolvedValue({ data: achievements });

    await useUserStore.getState().fetchAchievements();

    expect(mockedApi.get).toHaveBeenCalledWith(ApiURL.user.fetchAchievements);
    expect(useUserStore.getState().achievements).toEqual(achievements);
    expect(useUserStore.getState().achievementsLoading).toBe(false);
    expect(useUserStore.getState().achievementsError).toBeNull();
  });

  it('handles achievements fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Achievements failed'));

    await useUserStore.getState().fetchAchievements();

    expect(useUserStore.getState().achievementsLoading).toBe(false);
    expect(useUserStore.getState().achievementsError).toBe('Failed to fetch achievements');
  });

  it('sets achievements loading flags while fetching achievements', () => {
    let resolveRequest: (value: { data: any[] }) => void = () => undefined;
    mockedApi.get.mockReturnValue(
      new Promise(resolve => {
        resolveRequest = resolve;
      }) as any
    );

    const request = useUserStore.getState().fetchAchievements();

    expect(useUserStore.getState().achievementsLoading).toBe(true);
    expect(useUserStore.getState().achievementsError).toBeNull();

    resolveRequest({ data: [] });
    return request;
  });
});
