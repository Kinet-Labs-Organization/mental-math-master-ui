import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserStore } from '../store/useUserStore';
import api from '../utils/api';
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
    });
  });

  it('stores authenticated user in localStorage and state', () => {
    const user = { token: 'abc', email: 'test@example.com', name: 'Test User', avatar: 'avatar.png' };

    useUserStore.getState().setAuthenticatedUser(user);

    expect(JSON.parse(localStorage.getItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY)!)).toEqual(user);
    expect(useUserStore.getState().authenticatedUser).toEqual(user);
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
});