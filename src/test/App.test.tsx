import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('firebase/auth', () => ({
  getRedirectResult: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('../store/useUserStore', () => ({
  useUserStore: vi.fn(),
}));

vi.mock('../store/useConfigStore', () => ({
  useConfigStore: vi.fn(),
}));

vi.mock('../components/Navigation', () => ({
  Navigation: ({ activeSection, onSectionChange }: any) => (
    <div>
      <span>Navigation:{activeSection}</span>
      <button onClick={() => onSectionChange('dashboard')}>GoDashboard</button>
    </div>
  ),
  NavSection: {},
}));

vi.mock('../components/Login', () => ({
  Login: () => <div>Login Component</div>,
}));

vi.mock('../components/Onboarding', () => ({
  Onboarding: () => <div>Onboarding Component</div>,
}));

vi.mock('../components/GlobalToast', () => ({
  GlobalToast: () => <div>GlobalToast</div>,
}));

vi.mock('../routes', () => ({
  AppRoutes: () => <div>AppRoutes Component</div>,
}));

vi.mock('../utils/api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../utils/apiurl', () => ({
  default: {
    user: {
      userSync: '/user-sync',
      syncSubscription: '/sync-subscription',
    },
  },
}));

vi.mock('@capacitor/core', async () => {
  const actual = await vi.importActual<typeof import('@capacitor/core')>('@capacitor/core');
  return {
    ...actual,
    Capacitor: {
      ...actual.Capacitor,
      isNativePlatform: vi.fn(() => false),
    },
  };
});

vi.mock('../services/revenuecat', () => ({
  addRevenueCatSubscriptionListener: vi.fn(),
  configureRevenueCat: vi.fn(),
  getRevenueCatSubscriptionSnapshot: vi.fn(),
  isNativeRevenueCatEnabled: vi.fn(() => false),
}));

vi.mock('../libs/firebaseClient', () => ({
  firebaseAuth: { currentUser: { getIdToken: vi.fn() } },
  signOutFromFirebase: vi.fn(),
}));

import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { useUserStore } from '../store/useUserStore';
import { useConfigStore } from '../store/useConfigStore';
import api from '../utils/api';
import CONSTANTS from '../utils/constants';
import { firebaseAuth, signOutFromFirebase } from '../libs/firebaseClient';
import {
  addRevenueCatSubscriptionListener,
  configureRevenueCat,
  getRevenueCatSubscriptionSnapshot,
  isNativeRevenueCatEnabled,
} from '../services/revenuecat';
import App from '../App';

const getRedirectResultMock = vi.mocked(getRedirectResult);
const onAuthStateChangedMock = vi.mocked(onAuthStateChanged);
const useUserStoreMock = vi.mocked(useUserStore);
const useConfigStoreMock = vi.mocked(useConfigStore);
const apiMock = vi.mocked(api);
const capacitorIsNativePlatformMock = vi.mocked(Capacitor.isNativePlatform);
const signOutFromFirebaseMock = vi.mocked(signOutFromFirebase);
const addRevenueCatSubscriptionListenerMock = vi.mocked(addRevenueCatSubscriptionListener);
const configureRevenueCatMock = vi.mocked(configureRevenueCat);
const getRevenueCatSubscriptionSnapshotMock = vi.mocked(getRevenueCatSubscriptionSnapshot);
const isNativeRevenueCatEnabledMock = vi.mocked(isNativeRevenueCatEnabled);
const firebaseGetIdTokenMock = vi.mocked(firebaseAuth.currentUser!.getIdToken);

const getOnboardingFlagMock = vi.fn(() => false);
const removeAuthenticatedUserMock = vi.fn();
const setAuthenticatedUserMock = vi.fn();
const showTopEmptySpaceMock = vi.fn();
const showBottomEmptySpaceMock = vi.fn();
const showFooterNavigationMock = vi.fn();
const hideTopEmptySpaceMock = vi.fn();
const hideBottomEmptySpaceMock = vi.fn();
const hideFooterNavigationMock = vi.fn();

const createDefaultUserStore = () => ({
  getOnboardingFlag: getOnboardingFlagMock,
  authenticatedUser: null,
  setAuthenticatedUser: setAuthenticatedUserMock,
  removeAuthenticatedUser: removeAuthenticatedUserMock,
});

const createDefaultConfigStore = () => ({
  FooterNavigation: true,
  TopEmptySpace: true,
  BottomEmptySpace: true,
  showTopEmptySpace: showTopEmptySpaceMock,
  showBottomEmptySpace: showBottomEmptySpaceMock,
  showFooterNavigation: showFooterNavigationMock,
  hideFooterNavigation: hideFooterNavigationMock,
  hideTopEmptySpace: hideTopEmptySpaceMock,
  hideBottomEmptySpace: hideBottomEmptySpaceMock,
});

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    getRedirectResultMock.mockResolvedValue(null as any);
    getOnboardingFlagMock.mockReturnValue(false);
    useUserStoreMock.mockReturnValue(createDefaultUserStore());
    useConfigStoreMock.mockReturnValue(createDefaultConfigStore());
    onAuthStateChangedMock.mockImplementation(() => () => {});
    capacitorIsNativePlatformMock.mockReturnValue(false);
    isNativeRevenueCatEnabledMock.mockReturnValue(false);
    configureRevenueCatMock.mockResolvedValue(undefined);
    getRevenueCatSubscriptionSnapshotMock.mockResolvedValue({
      status: 'PRO',
      subscriptionExpiration: '1710000000000',
      term: 'd30',
    });
    addRevenueCatSubscriptionListenerMock.mockResolvedValue(vi.fn());
    firebaseGetIdTokenMock.mockResolvedValue('refreshed-token');
    apiMock.post.mockResolvedValue({});
  });

  it('shows a loading spinner while authentication is in progress', () => {
    onAuthStateChangedMock.mockImplementation(() => () => {});

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(container.querySelector('.animate-spin')).not.toBeNull();
  });

  it('redirects unauthenticated users to onboarding when onboarding flag is true', async () => {
    getOnboardingFlagMock.mockReturnValue(true);
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Onboarding Component')).toBeDefined();
    expect(removeAuthenticatedUserMock).toHaveBeenCalledTimes(1);
  });

  it('redirects unauthenticated users from onboarding path to login when onboarding is disabled', async () => {
    getOnboardingFlagMock.mockReturnValue(false);
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Component')).toBeDefined();
  });

  it('renders the authenticated app layout and hides config sections for /regulargame', async () => {
    const firebaseUser = {
      getIdToken: vi.fn().mockResolvedValue('token-xyz'),
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'avatar.png',
    };

    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(firebaseUser);
      return () => {};
    });

    useUserStoreMock.mockReturnValue({
      getOnboardingFlag: getOnboardingFlagMock,
      authenticatedUser: { token: 'token-xyz', email: 'test@example.com' },
      setAuthenticatedUser: setAuthenticatedUserMock,
      removeAuthenticatedUser: removeAuthenticatedUserMock,
    });

    render(
      <MemoryRouter initialEntries={['/regulargame']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('AppRoutes Component')).toBeDefined();
    expect(screen.getByText('Navigation:dashboard')).toBeDefined();
    expect(hideTopEmptySpaceMock).toHaveBeenCalledTimes(1);
    expect(hideBottomEmptySpaceMock).toHaveBeenCalledTimes(1);
    expect(hideFooterNavigationMock).toHaveBeenCalledTimes(1);
    expect(apiMock.post).toHaveBeenCalledWith('/user-sync', {
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'avatar.png',
    });
    expect(setAuthenticatedUserMock).toHaveBeenCalledWith({
      token: 'token-xyz',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'avatar.png',
    });
  });

  it('redirects authenticated users away from login to the main app', async () => {
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ getIdToken: vi.fn().mockResolvedValue('token-xyz'), email: 'a@b.com' });
      return () => {};
    });

    useUserStoreMock.mockReturnValue({
      getOnboardingFlag: getOnboardingFlagMock,
      authenticatedUser: { token: 'token-xyz', email: 'a@b.com' },
      setAuthenticatedUser: setAuthenticatedUserMock,
      removeAuthenticatedUser: removeAuthenticatedUserMock,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('AppRoutes Component')).toBeDefined();
    expect(screen.getByText('Navigation:dashboard')).toBeDefined();
  });

  it('renders onboarding path for unauthenticated users when onboarding is enabled', async () => {
    getOnboardingFlagMock.mockReturnValue(true);
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Onboarding Component')).toBeDefined();
  });

  it('shows config sections and active profile navigation on profile routes', async () => {
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ getIdToken: vi.fn().mockResolvedValue('token-xyz'), email: 'a@b.com' });
      return () => {};
    });
    useUserStoreMock.mockReturnValue({
      getOnboardingFlag: getOnboardingFlagMock,
      authenticatedUser: { token: 'token-xyz', email: 'a@b.com' },
      setAuthenticatedUser: setAuthenticatedUserMock,
      removeAuthenticatedUser: removeAuthenticatedUserMock,
    });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Navigation:profile')).toBeDefined();
    expect(showTopEmptySpaceMock).toHaveBeenCalledTimes(1);
    expect(showBottomEmptySpaceMock).toHaveBeenCalledTimes(1);
    expect(showFooterNavigationMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('GoDashboard'));
    expect(await screen.findByText('Navigation:dashboard')).toBeDefined();
  });

  it('does not render footer navigation or spacer blocks when config disables them', async () => {
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ getIdToken: vi.fn().mockResolvedValue('token-xyz'), email: 'a@b.com' });
      return () => {};
    });
    useUserStoreMock.mockReturnValue({
      getOnboardingFlag: getOnboardingFlagMock,
      authenticatedUser: { token: 'token-xyz', email: 'a@b.com' },
      setAuthenticatedUser: setAuthenticatedUserMock,
      removeAuthenticatedUser: removeAuthenticatedUserMock,
    });
    useConfigStoreMock.mockReturnValue({
      ...createDefaultConfigStore(),
      FooterNavigation: false,
      TopEmptySpace: false,
      BottomEmptySpace: false,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('AppRoutes Component')).toBeDefined();
    expect(screen.queryByText(/Navigation:/)).toBeNull();
  });

  it('handles firebase user processing errors by clearing local auth and signing out', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const firebaseError = new Error('token failed');
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ getIdToken: vi.fn().mockRejectedValue(firebaseError), email: 'a@b.com' });
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Firebase auth processing error:', firebaseError);
      expect(removeAuthenticatedUserMock).toHaveBeenCalledTimes(1);
      expect(signOutFromFirebaseMock).toHaveBeenCalledTimes(1);
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles onAuthStateChanged observer errors', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const authError = new Error('observer failed');
    onAuthStateChangedMock.mockImplementation((_auth, _callback, errorCallback) => {
      errorCallback(authError);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('onAuthStateChanged error:', authError);
      expect(screen.getByText('Login Component')).toBeDefined();
    });

    consoleErrorSpy.mockRestore();
  });

  it('logs redirect result errors on web platforms', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const redirectError = new Error('redirect failed');
    getRedirectResultMock.mockRejectedValue(redirectError);
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getRedirectResultMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Firebase redirect result error:', redirectError);
    });

    consoleErrorSpy.mockRestore();
  });

  it('skips redirect result checks on native platforms', async () => {
    capacitorIsNativePlatformMock.mockReturnValue(true);
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await screen.findByText('Login Component');
    expect(getRedirectResultMock).not.toHaveBeenCalled();
  });

  it('skips user sync API call when an authenticated user is already stored', async () => {
    localStorage.setItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY, JSON.stringify({ token: 'old' }));
    const firebaseUser = {
      getIdToken: vi.fn().mockResolvedValue('token-xyz'),
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'avatar.png',
    };
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(firebaseUser);
      return () => {};
    });
    useUserStoreMock.mockReturnValue({
      getOnboardingFlag: getOnboardingFlagMock,
      authenticatedUser: { token: 'token-xyz', email: 'test@example.com' },
      setAuthenticatedUser: setAuthenticatedUserMock,
      removeAuthenticatedUser: removeAuthenticatedUserMock,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('AppRoutes Component')).toBeDefined();
    expect(apiMock.post).not.toHaveBeenCalledWith('/user-sync', expect.anything());
  });

  it('logs user sync errors and still stores the firebase user', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const syncError = new Error('sync failed');
    apiMock.post.mockRejectedValue(syncError);
    const firebaseUser = {
      getIdToken: vi.fn().mockResolvedValue('token-xyz'),
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'avatar.png',
    };
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(firebaseUser);
      return () => {};
    });
    useUserStoreMock.mockReturnValue({
      getOnboardingFlag: getOnboardingFlagMock,
      authenticatedUser: { token: 'token-xyz', email: 'test@example.com' },
      setAuthenticatedUser: setAuthenticatedUserMock,
      removeAuthenticatedUser: removeAuthenticatedUserMock,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('User sync error:', syncError);
      expect(setAuthenticatedUserMock).toHaveBeenCalledWith({
        token: 'token-xyz',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'avatar.png',
      });
    });

    consoleErrorSpy.mockRestore();
  });

  it('syncs native RevenueCat subscription snapshots and ignores duplicates', async () => {
    capacitorIsNativePlatformMock.mockReturnValue(true);
    isNativeRevenueCatEnabledMock.mockReturnValue(true);
    let listenerCallback: any;
    const removeListener = vi.fn().mockResolvedValue(undefined);
    addRevenueCatSubscriptionListenerMock.mockImplementation(async callback => {
      listenerCallback = callback;
      return removeListener;
    });
    useUserStoreMock.mockReturnValue({
      getOnboardingFlag: getOnboardingFlagMock,
      authenticatedUser: { token: 'token-xyz', email: 'test@example.com' },
      setAuthenticatedUser: setAuthenticatedUserMock,
      removeAuthenticatedUser: removeAuthenticatedUserMock,
    });
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ getIdToken: vi.fn().mockResolvedValue('token-xyz'), email: 'test@example.com' });
      return () => {};
    });

    const { unmount } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(configureRevenueCatMock).toHaveBeenCalledWith('test@example.com');
      expect(apiMock.post).toHaveBeenCalledWith('/sync-subscription', {
        status: 'PRO',
        subscriptionExpiration: '1710000000000',
      });
    });
    expect(firebaseGetIdTokenMock).toHaveBeenCalledWith(true);

    await listenerCallback({
      status: 'PRO',
      subscriptionExpiration: '1710000000000',
      term: 'd30',
    });
    expect(apiMock.post.mock.calls.filter(call => call[0] === '/sync-subscription')).toHaveLength(1);

    await listenerCallback({
      status: 'UNSUBSCRIBED',
      subscriptionExpiration: null,
      term: null,
    });
    expect(apiMock.post).toHaveBeenCalledWith('/sync-subscription', {
      status: 'UNSUBSCRIBED',
      subscriptionExpiration: null,
    });

    unmount();
    await waitFor(() => {
      expect(removeListener).toHaveBeenCalledTimes(1);
    });
  });

  it('logs RevenueCat sync initialization failures', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const revenueCatError = new Error('revenuecat failed');
    capacitorIsNativePlatformMock.mockReturnValue(true);
    isNativeRevenueCatEnabledMock.mockReturnValue(true);
    configureRevenueCatMock.mockRejectedValue(revenueCatError);
    useUserStoreMock.mockReturnValue({
      getOnboardingFlag: getOnboardingFlagMock,
      authenticatedUser: { token: 'token-xyz', email: 'test@example.com' },
      setAuthenticatedUser: setAuthenticatedUserMock,
      removeAuthenticatedUser: removeAuthenticatedUserMock,
    });
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ getIdToken: vi.fn().mockResolvedValue('token-xyz'), email: 'test@example.com' });
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize RevenueCat subscription listener:',
        revenueCatError
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
