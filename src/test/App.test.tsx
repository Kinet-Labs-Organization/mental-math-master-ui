import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('firebase/auth', () => ({
  getRedirectResult: async () => null,
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

vi.mock('./services/revenuecat', () => ({
  addRevenueCatSubscriptionListener: vi.fn(),
  configureRevenueCat: vi.fn(),
  getRevenueCatSubscriptionSnapshot: vi.fn(),
  isNativeRevenueCatEnabled: vi.fn(() => false),
}));

vi.mock('../libs/firebaseClient', () => ({
  firebaseAuth: { currentUser: null },
  signOutFromFirebase: vi.fn(),
}));

import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from '../store/useUserStore';
import { useConfigStore } from '../store/useConfigStore';
import api from '../utils/api';
import { signOutFromFirebase } from '../libs/firebaseClient';
import App from '../App';

const getRedirectResultMock = vi.mocked(getRedirectResult);
const onAuthStateChangedMock = vi.mocked(onAuthStateChanged);
const useUserStoreMock = vi.mocked(useUserStore);
const useConfigStoreMock = vi.mocked(useConfigStore);
const apiMock = vi.mocked(api);
const signOutFromFirebaseMock = vi.mocked(signOutFromFirebase);

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
    getOnboardingFlagMock.mockReturnValue(false);
    useUserStoreMock.mockReturnValue(createDefaultUserStore());
    useConfigStoreMock.mockReturnValue(createDefaultConfigStore());
    onAuthStateChangedMock.mockImplementation(() => () => {});
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
});
