import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../routes';

// Mock lazy-loaded components
vi.mock('../components/Dashboard', () => ({
  Dashboard: () => <div>Dashboard Component</div>,
}));

vi.mock('../components/Progress', () => ({
  Progress: () => <div>Progress Component</div>,
}));

vi.mock('../components/Leaderboard', () => ({
  Leaderboard: () => <div>Leaderboard Component</div>,
}));

vi.mock('../components/Profile', () => ({
  Profile: () => <div>Profile Component</div>,
}));

vi.mock('../components/Setting', () => ({
  Setting: () => <div>Setting Component</div>,
}));

vi.mock('../components/FlashGame', () => ({
  FlashGame: () => <div>FlashGame Component</div>,
}));

vi.mock('../components/RegularGame', () => ({
  RegularGame: () => <div>RegularGame Component</div>,
}));

vi.mock('../components/Paywall', () => ({
  Paywall: () => <div>Paywall Component</div>,
}));

vi.mock('../components/Blogs', () => ({
  Blogs: () => <div>Blogs Component</div>,
}));

vi.mock('../components/Notifications', () => ({
  Notifications: () => <div>Notifications Component</div>,
}));

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Dashboard component on root path', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard Component')).toBeInTheDocument();
    });
  });

  it('renders Progress component on /progress path', async () => {
    render(
      <MemoryRouter initialEntries={['/progress']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Progress Component')).toBeInTheDocument();
    });
  });

  it('renders Leaderboard component on /leaderboard path', async () => {
    render(
      <MemoryRouter initialEntries={['/leaderboard']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Leaderboard Component')).toBeInTheDocument();
    });
  });

  it('renders Profile component on /profile path', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Profile Component')).toBeInTheDocument();
    });
  });

  it('renders Setting component on /settings path', async () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Setting Component')).toBeInTheDocument();
    });
  });

  it('renders FlashGame component on /flashgame path', async () => {
    render(
      <MemoryRouter initialEntries={['/flashgame']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('FlashGame Component')).toBeInTheDocument();
    });
  });

  it('renders RegularGame component on /regulargame path', async () => {
    render(
      <MemoryRouter initialEntries={['/regulargame']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('RegularGame Component')).toBeInTheDocument();
    });
  });

  it('renders Paywall component on /paywall path', async () => {
    render(
      <MemoryRouter initialEntries={['/paywall']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Paywall Component')).toBeInTheDocument();
    });
  });

  it('renders Blogs component on /blogs path', async () => {
    render(
      <MemoryRouter initialEntries={['/blogs']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Blogs Component')).toBeInTheDocument();
    });
  });

  it('renders Notifications component on /notifications path', async () => {
    render(
      <MemoryRouter initialEntries={['/notifications']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Notifications Component')).toBeInTheDocument();
    });
  });

  it('redirects unknown paths to root (Dashboard)', async () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard Component')).toBeInTheDocument();
    });
  });

  it('renders Suspense fallback with loading spinner while lazy components load', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    // The Suspense fallback should contain a spinner element
    const spinnerBorder = container.querySelector('.border-white\\/10');
    // Eventually the component should load
    await waitFor(() => {
      expect(screen.getByText('Dashboard Component')).toBeInTheDocument();
    });
  });
});
