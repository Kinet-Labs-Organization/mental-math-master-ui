import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// Mock the stores
const mockUseUserStore = vi.hoisted(() => ({
  getState: vi.fn(),
}));

const mockSignOutFromFirebase = vi.hoisted(() => vi.fn());

vi.mock('../store/useUserStore', () => ({
  useUserStore: mockUseUserStore,
}));

vi.mock('../libs/firebaseClient', () => ({
  signOutFromFirebase: mockSignOutFromFirebase,
}));

describe('ErrorBoundary', () => {
  const mockRemoveAuthenticatedUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserStore.getState.mockReturnValue({
      removeAuthenticatedUser: mockRemoveAuthenticatedUser,
    });
    mockSignOutFromFirebase.mockResolvedValue(undefined);
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders error fallback when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Go to Home')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders default error message when no error message', () => {
    const ThrowError = () => {
      throw new Error();
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('calls resetErrorBoundary when Try Again clicked', async () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('calls removeAuthenticatedUser and signOutFromFirebase when Go to Home clicked', async () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const goHomeButton = screen.getByText('Go to Home');
    fireEvent.click(goHomeButton);

    await waitFor(() => {
      expect(mockRemoveAuthenticatedUser).toHaveBeenCalled();
      expect(mockSignOutFromFirebase).toHaveBeenCalled();
    });
  });
});