import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore';

// Mock Firebase to avoid auth initialization issues
vi.mock('../libs/firebaseClient', () => ({
  auth: {},
  googleProvider: {},
}));

// A simplified interface for what our store might look like
interface GameState {
  score: number;
  answers: any[];
  incrementScore: (by: number) => void;
  addAnswer: (answer: any) => void;
}

// Reset store before each test to ensure isolation
beforeEach(() => {
  act(() => {
    useGameStore.setState({
      score: 0,
      answers: [],
    });
  });
});

describe('useGameStore', () => {
  it('should have a default score of 0', () => {
    const { result } = renderHook(() => useGameStore());
    expect(result.current.score).toBe(0);
  });

  it('should increment score when incrementScore is called', () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.incrementScore(10);
    });

    expect(result.current.score).toBe(10);
  });

  it('should add an answer when addAnswer is called', () => {
    const { result } = renderHook(() => useGameStore());
    const answer = { question: '2+2', userAnswer: '4', isCorrect: true };

    act(() => {
      result.current.addAnswer(answer);
    });

    expect(result.current.answers).toHaveLength(1);
    expect(result.current.answers[0]).toEqual(answer);
  });
});