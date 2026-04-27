import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ScoreDisplay from '../components/ScoreDisplay'; // Hypothetical component

describe('ScoreDisplay', () => {
  it('should render the score correctly', () => {
    const score = 150;
    render(<ScoreDisplay score={score} />);

    // Find the element that displays the score.
    // Using a regex makes the test resilient to minor text changes (e.g., "Score: 150").
    const scoreElement = screen.getByText(/150/);

    expect(scoreElement).toBeInTheDocument();
  });

  it('should render zero when the score is 0', () => {
    render(<ScoreDisplay score={0} />);
    const scoreElement = screen.getByText(/0/);
    expect(scoreElement).toBeInTheDocument();
  });
});