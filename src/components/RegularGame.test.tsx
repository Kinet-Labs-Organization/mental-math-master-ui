import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  ViewAllQuestionsDialog: ({
    questions = [],
    handleQuestionNavigate,
    handleSubmit,
    allQuestionsAnswered,
  }: any) => (
    <div>
      <button type="button" onClick={() => handleQuestionNavigate?.(questions.length - 1)}>
        Jump to last question
      </button>
      <button type="button" onClick={handleSubmit} disabled={!allQuestionsAnswered}>
        Dialog Submit
      </button>
    </div>
  ),
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

const mixedOperationGame = [
  [
    { value: '10', operation: '' },
    { value: '5', operation: 'subtract' },
    { value: '3', operation: 'multiply' },
    { value: '2', operation: 'divide' },
  ],
];

const sixQuestionGame = Array.from({ length: 6 }, (_, index) => [
  { value: String(index + 1), operation: '' },
  { value: '1', operation: 'add' },
]);

const renderWithGameStore = ({
  selected = selectedGame,
  game = null,
  gameLoading = false,
}: {
  selected?: any;
  game?: any;
  gameLoading?: boolean;
} = {}) => {
  mockUseGameStore.mockReturnValue({
    selectedGame: selected,
    game,
    fetchGame: mockFetchGame,
    gameLoading,
    setGame: mockSetGame,
  });

  return render(<RegularGame />);
};

describe('RegularGame', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockFetchGame.mockReset();
    mockSetGame.mockReset();
    mockApiPost.mockReset();
    mockApiPost.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('redirects to home when no selected game is present', () => {
    renderWithGameStore({ selected: null });

    expect(screen.getByText('Navigate to /')).toBeInTheDocument();
  });

  it('renders ready screen and starts game when start button is clicked', () => {
    renderWithGameStore();

    expect(screen.getByText('Ready to Train?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Start Training/i }));
    expect(mockFetchGame).toHaveBeenCalledTimes(1);
  });

  it('shows loading on the ready screen while a game is being fetched', () => {
    renderWithGameStore({ gameLoading: true });

    expect(screen.getByRole('button', { name: 'Loading' })).toBeInTheDocument();
  });

  it('clears the game and navigates home from the ready screen back button', () => {
    renderWithGameStore();

    fireEvent.click(screen.getByRole('button', { name: /Back/i }));

    expect(mockSetGame).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders the first question when game data is available and allows submitting a correct answer', async () => {
    renderWithGameStore({ game: sampleGame });

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

  it('renders the loading questions fallback when generated game data has no questions', async () => {
    renderWithGameStore({ game: [] });

    await waitFor(() => {
      expect(screen.getByText('Loading questions...')).toBeInTheDocument();
    });
  });

  it('handles subtract, multiply, and divide operations with rounded answers', async () => {
    const divideGame = {
      ...selectedGame,
      operations: ['subtract', 'multiply', 'divide'],
    };
    renderWithGameStore({ selected: divideGame, game: mixedOperationGame });

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
    });

    expect(screen.getByText(/Division answers are rounded/)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Enter your answer/i), {
      target: { value: '7.5' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit Answers/i }));

    await waitFor(() => {
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
    expect(mockApiPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        correctAnswerGiven: 1,
        wrongAnswerGiven: 0,
      })
    );
  });

  it('reviews wrong and unanswered questions after submit', async () => {
    const twoQuestionGame = [
      [
        { value: '2', operation: '' },
        { value: '2', operation: 'add' },
      ],
      [
        { value: '9', operation: '' },
        { value: '3', operation: 'subtract' },
      ],
    ];
    renderWithGameStore({ game: twoQuestionGame });

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter your answer/i), {
      target: { value: '99' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit Answers/i }));

    await waitFor(() => {
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
    });
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('Correct: 4')).toBeInTheDocument();
    expect(screen.getByText('No answer')).toBeInTheDocument();
    expect(screen.getByText('Correct: 6')).toBeInTheDocument();
    expect(mockApiPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        correctAnswerGiven: 0,
        wrongAnswerGiven: 2,
      })
    );
  });

  it('supports next, previous, dialog navigation, and elapsed time while playing', async () => {
    vi.useFakeTimers();
    renderWithGameStore({ game: sixQuestionGame });

    expect(screen.getByText('Question 1 of 6')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(61_000);
    });
    expect(screen.getByText('01:01')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Question 2 of 6')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    expect(screen.getByText('Question 1 of 6')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Jump to last question/i }));
    expect(screen.getByText('Question 6 of 6')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    expect(screen.getByText('Question 1 of 6')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('enables dialog submit only after all questions are answered', async () => {
    renderWithGameStore({ game: sampleGame });

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Dialog Submit/i })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/Enter your answer/i), {
      target: { value: '5' },
    });
    expect(screen.getByRole('button', { name: /Dialog Submit/i })).not.toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /Dialog Submit/i }));
    await waitFor(() => {
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
    });
  });

  it('still shows submitted results when saving fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mockApiPost.mockRejectedValue(new Error('save failed'));
    renderWithGameStore({ game: sampleGame });

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter your answer/i), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit Answers/i }));

    await waitFor(() => {
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save regular game:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('clears the game and navigates home from the submitted screen', async () => {
    renderWithGameStore({ game: sampleGame });

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter your answer/i), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit Answers/i }));

    await waitFor(() => {
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Back to Dashboard/i }));

    expect(mockSetGame).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
