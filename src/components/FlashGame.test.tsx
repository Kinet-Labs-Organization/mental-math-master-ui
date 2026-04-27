import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FlashGame } from './FlashGame';

// Mock the stores and hooks
const mockUseGameStore = vi.hoisted(() => vi.fn(() => ({})));
const mockUseUserStore = vi.hoisted(() => vi.fn(() => ({})));
const mockUseNavigate = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockApiPost = vi.hoisted(() => vi.fn());

const advanceToInputState = () => {
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  act(() => {
    vi.advanceTimersByTime(500);
  });
};

vi.mock('../store/useGameStore', () => ({
  useGameStore: mockUseGameStore,
}));

vi.mock('../store/useUserStore', () => ({
  useUserStore: mockUseUserStore,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: mockUseNavigate,
  Navigate: ({ to }: any) => <div data-testid="navigate" data-to={to} />,
}));

vi.mock('../utils/api', () => ({
  default: {
    post: mockApiPost,
  },
}));

vi.mock('../assets/sound.mp3', () => ({ default: 'mock-sound-url' }));

vi.mock('../config/env', () => ({
  default: {
    imageBaseURL: 'https://example.com/',
  },
}));

vi.mock('motion/react', () => {
  const motionProps = [
    'whileHover',
    'whileTap',
    'initial',
    'animate',
    'exit',
    'transition',
  ];

  const createMotion = (tag: string) => ({ children, ...props }: any) => {
    motionProps.forEach(prop => delete props[prop]);
    return React.createElement(tag, props, children);
  };

  return {
    motion: {
      div: createMotion('div'),
      button: createMotion('button'),
      circle: createMotion('circle'),
    },
  };
});

// Mock Audio globally
global.Audio = vi.fn().mockImplementation(function() {
  this.play = vi.fn().mockResolvedValue(undefined);
  this.pause = vi.fn();
  this.currentTime = 0;
});

describe('FlashGame', () => {
  const mockNavigate = vi.fn();
  const mockFetchGame = vi.fn();
  const mockSetGame = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockApiPost.mockResolvedValue({});
    
    // Set up default mock returns
    mockUseGameStore.mockReturnValue({
      selectedGame: null,
      game: null,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: {},
      fetchSettingsData: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('navigates to home if no selectedGame', () => {
    render(<FlashGame />);

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
  });

  it('renders ready state', () => {
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
    };

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: null,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: {},
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    expect(screen.getByText('Ready to Train?')).toBeInTheDocument();
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('Start Training')).toBeInTheDocument();
  });

  it('shows loading when gameLoading', () => {
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
    };

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: null,
      fetchGame: mockFetchGame,
      gameLoading: true,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: {},
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('starts game when start button clicked', () => {
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: null,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: {},
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    const startButton = screen.getByText('Start Training');
    fireEvent.click(startButton);

    expect(mockFetchGame).toHaveBeenCalled();
  });

  it('renders playing state with add operation', () => {
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'add' },
      { value: 3, operation: 'add' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('renders playing state with subtract operation', () => {
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'subtract' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders playing state with multiply operation', () => {
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'multiply' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders playing state with divide operation', () => {
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
      operations: ['divide'],
    };
    const mockGame = [
      { value: 5, operation: 'divide' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders input state', async () => {
    vi.useRealTimers();
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'add' },
      { value: 3, operation: 'add' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    await new Promise(resolve => setTimeout(resolve, 2600));

    expect(screen.getByText("What's the answer?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter result')).toBeInTheDocument();
  });

  it('validates correct answer', async () => {
    vi.useRealTimers();
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'add' },
      { value: 3, operation: 'add' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    await new Promise(resolve => setTimeout(resolve, 2600));

    const input = screen.getByPlaceholderText('Enter result');
    fireEvent.change(input, { target: { value: '8' } });

    const validateButton = screen.getByText('Validate');
    fireEvent.click(validateButton);

    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('validates incorrect answer', async () => {
    vi.useRealTimers();
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'add' },
      { value: 3, operation: 'add' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    await new Promise(resolve => setTimeout(resolve, 2600));

    const input = screen.getByPlaceholderText('Enter result');
    fireEvent.change(input, { target: { value: '10' } });

    const validateButton = screen.getByText('Validate');
    fireEvent.click(validateButton);

    expect(screen.getByText('Wrong Answer')).toBeInTheDocument();
  });

  it('saves game result for non-custom games', async () => {
    vi.useRealTimers();
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'add' },
      { value: 3, operation: 'add' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    await new Promise(resolve => setTimeout(resolve, 2600));

    const input = screen.getByPlaceholderText('Enter result');
    fireEvent.change(input, { target: { value: '8' } });

    const validateButton = screen.getByText('Validate');
    fireEvent.click(validateButton);

    expect(mockApiPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        gameId: 'test-game',
        correctAnswerGiven: 1,
      })
    );
  });

  it('does not save game result for custom games', async () => {
    vi.useRealTimers();
    const mockSelectedGame = {
      id: 'custom',
      name: 'Custom Practice',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'add' },
      { value: 3, operation: 'add' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    await new Promise(resolve => setTimeout(resolve, 2600));

    const input = screen.getByPlaceholderText('Enter result');
    fireEvent.change(input, { target: { value: '8' } });

    const validateButton = screen.getByText('Validate');
    fireEvent.click(validateButton);

    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it('navigates back when back button clicked', () => {
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
    };

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: null,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: {},
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockSetGame).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('plays again when play again button clicked', async () => {
    vi.useRealTimers();
    const mockSelectedGame = {
      id: 'test-game',
      name: 'Test Game',
      digitCount: 2,
      numberCount: 3,
      icon: 1,
      delay: 1000,
    };
    const mockGame = [
      { value: 5, operation: 'add' },
      { value: 3, operation: 'add' },
    ];

    mockUseGameStore.mockReturnValue({
      selectedGame: mockSelectedGame,
      game: mockGame,
      fetchGame: mockFetchGame,
      gameLoading: false,
      setGame: mockSetGame,
    });
    mockUseUserStore.mockReturnValue({
      settingsData: { soundEffect: true },
      fetchSettingsData: vi.fn(),
    });

    render(<FlashGame />);

    await new Promise(resolve => setTimeout(resolve, 2600));

    const input = screen.getByPlaceholderText('Enter result');
    fireEvent.change(input, { target: { value: '8' } });

    const validateButton = screen.getByText('Validate');
    fireEvent.click(validateButton);

    expect(screen.getByText('Success!')).toBeInTheDocument();

    const playAgainButton = screen.getByText('Play Again');
    fireEvent.click(playAgainButton);

    expect(screen.getByText('Ready to Train?')).toBeInTheDocument();
  });
});