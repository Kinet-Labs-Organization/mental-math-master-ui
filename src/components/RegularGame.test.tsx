import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegularGame } from './RegularGame';

const mockNavigate = vi.fn();
const mockFetchGame = vi.fn();
const mockSetGame = vi.fn();
const mockApiPost = vi.hoisted(() => vi.fn().mockResolvedValue({}));

const mockUseGameStore = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Navigate: ({ to }: any) => <div>Navigate to {to}</div>,
  };
});

vi.mock('../store/useGameStore', () => ({
  useGameStore: mockUseGameStore,
}));

vi.mock('./ViewAllQuestionsDialog', () => ({
  ViewAllQuestionsDialog: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../config/env', () => ({
  default: {
    imageBaseURL: 'https://example.com',
  },
}));

vi.mock('../utils/api', () => ({
  default: {
    post: mockApiPost,
  },
}));

const selectedGame = {
  id: 'regular-1',
  name: 'Regular Challenge',
  digitCount: 2,
  numberCount: 2,
  operations: ['add'],
  delay: 0,
  type: 'regular',
  icon: '1',
};

const sampleGame = [
  [
    { value: '2', operation: '' },
    { value: '3', operation: 'add' },
  ],
];

describe('RegularGame', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockFetchGame.mockReset();
    mockSetGame.mockReset();
    mockApiPost.mockReset();
  });

  it('redirects to home when no selected game is present', () => {
    mockUseGameStore.mockReturnValue({
      selectedGame: null,
      game: null,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });

    render(<RegularGame />);

    expect(screen.getByText('Navigate to /')).toBeInTheDocument();
  });

  it('renders ready screen and starts game when start button is clicked', () => {
    mockUseGameStore.mockReturnValue({
      selectedGame,
      game: null,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });

    render(<RegularGame />);

    expect(screen.getByText('Ready to Train?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Start Training/i }));
    expect(mockFetchGame).toHaveBeenCalledTimes(1);
  });

  it('renders the first question when game data is available and allows submitting a correct answer', async () => {
    mockUseGameStore.mockReturnValue({
      selectedGame,
      game: sampleGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });

    render(<RegularGame />);

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Enter your answer/i);
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Answers/i }));

    await waitFor(() => {
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
      expect(screen.getByText('Score')).toBeInTheDocument();
      expect(mockApiPost).toHaveBeenCalledTimes(1);
    });
  });
});
