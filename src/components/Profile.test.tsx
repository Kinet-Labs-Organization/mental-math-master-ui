import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Profile } from './Profile';

const mocks = {
  fetchNotifications: vi.fn(),
  fetchAchievements: vi.fn(),
  fetchProfile: vi.fn(),
  fetchBlogs: vi.fn(),
  navigate: vi.fn(),
};

let notificationsState: any = {
  unread: 1,
  notifications: [
    {
      id: 1,
      title: 'New course unlocked',
      message: 'You have access to advanced drills.',
      time: new Date().toISOString(),
      read: false,
    },
  ],
};

let notificationsLoading = false;
let blogsState: any[] = [
  { title: 'Faster Mental Math', link: 'https://example.com/article', read: '4 min', icon: '📘' },
];
let blogsLoading = false;
let authenticatedUser: any = { avatar: 'https://example.com/avatar.png' };
let profile: any = {
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date().toISOString(),
  plan: { planId: 'TRIAL', planNameToShow: 'Trial', planAction: 'Upgrade now' },
};
let achievements: any[] = [
  { title: 'First Win', description: 'Complete your first game', unlocked: true, icon: '🏆' },
];
let achievementsLoading = false;
let profileLoading = false;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock('../store/useUserStore', () => ({
  useUserStore: () => ({
    fetchNotifications: mocks.fetchNotifications,
    notifications: notificationsState,
    notificationsLoading,
    authenticatedUser,
    achievements,
    achievementsLoading,
    fetchAchievements: mocks.fetchAchievements,
    profile,
    profileLoading,
    fetchProfile: mocks.fetchProfile,
  }),
}));

vi.mock('../store/useGenericStore', () => ({
  useGenericStore: () => ({
    fetchBlogs: mocks.fetchBlogs,
    blogs: blogsState,
    blogsLoading,
  }),
}));

describe('Profile', () => {
  beforeEach(() => {
    mocks.fetchNotifications.mockReset();
    mocks.fetchAchievements.mockReset();
    mocks.fetchProfile.mockReset();
    mocks.fetchBlogs.mockReset();
    mocks.navigate.mockReset();

    notificationsState = {
      unread: 1,
      notifications: [
        {
          id: 1,
          title: 'New course unlocked',
          message: 'You have access to advanced drills.',
          time: new Date().toISOString(),
          read: false,
        },
      ],
    };
    notificationsLoading = false;
    blogsState = [
      { title: 'Faster Mental Math', link: 'https://example.com/article', read: '4 min', icon: '📘' },
    ];
    blogsLoading = false;
    authenticatedUser = { avatar: 'https://example.com/avatar.png' };
    profile = {
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      plan: { planId: 'TRIAL', planNameToShow: 'Trial', planAction: 'Upgrade now' },
    };
    achievements = [
      { title: 'First Win', description: 'Complete your first game', unlocked: true, icon: '🏆' },
    ];
    achievementsLoading = false;
    profileLoading = false;

    window.open = vi.fn();
  });

  it('fetches profile, notifications, blogs, and achievements on mount', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(mocks.fetchNotifications).toHaveBeenCalledWith(2);
      expect(mocks.fetchBlogs).toHaveBeenCalledWith(4);
      expect(mocks.fetchProfile).toHaveBeenCalledTimes(1);
      expect(mocks.fetchAchievements).toHaveBeenCalledTimes(1);
    });
  });

  it('renders profile blocks, notification badge, blog entry, and achievement', () => {
    render(<Profile />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText('New course unlocked')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Faster Mental Math')).toBeInTheDocument();
    expect(screen.getByText('First Win')).toBeInTheDocument();
  });

  it('opens notification details when a notification is clicked', async () => {
    render(<Profile />);

    fireEvent.click(screen.getByText('New course unlocked'));

    await waitFor(() => {
      expect(screen.getByText('You have access to advanced drills.')).toBeInTheDocument();
    });
  });

  it('navigates to paywall when the profile plan is trial', () => {
    render(<Profile />);

    fireEvent.click(screen.getByText('Trial'));

    expect(mocks.navigate).toHaveBeenCalledWith('/paywall');
  });

  it('opens blog links in a new tab when a blog item is clicked', () => {
    render(<Profile />);

    fireEvent.click(screen.getByText('Faster Mental Math'));

    expect(window.open).toHaveBeenCalledWith('https://example.com/article', '_blank', 'noopener,noreferrer');
  });
});
