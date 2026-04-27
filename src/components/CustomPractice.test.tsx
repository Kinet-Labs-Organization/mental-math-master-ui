import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CustomPractice } from './CustomPractice';

describe('CustomPractice', () => {
  const mockOnStart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    expect(screen.getByText('Custom Practice')).toBeInTheDocument();
    expect(screen.getByText('Start Practice')).toBeInTheDocument();
    expect(screen.getByText('Number of Digits')).toBeInTheDocument();
  });

  it('toggles expansion when header is clicked', async () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const header = screen.getByText('Custom Practice').closest('button');
    fireEvent.click(header!);

    await waitFor(() => {
      const digitLabel = screen.getByText('Number of Digits');
      const motionDiv = digitLabel.closest('.overflow-hidden');
      expect(motionDiv).toHaveStyle('opacity: 0');
    });

    fireEvent.click(header!);

    await waitFor(() => {
      const digitLabel = screen.getByText('Number of Digits');
      const motionDiv = digitLabel.closest('.overflow-hidden');
      expect(motionDiv).toHaveStyle('opacity: 1');
    });
  });

  it('changes digit count when button clicked', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const digitButton = screen.getByText('4');
    fireEvent.click(digitButton);

    expect(digitButton.closest('button')).toHaveClass('bg-gradient-to-r');
  });

  it('shows divisor digits when divide operation selected', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const operationButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.querySelector('svg')?.classList.contains('lucide-divide')
    );
    const divideButton = operationButtons[0];
    fireEvent.click(divideButton);

    expect(screen.getByText('Number of Digits in Dividend')).toBeInTheDocument();
    expect(screen.getByText('Number of Digits in Divisor')).toBeInTheDocument();
  });

  it('sets number count to 2 when divide selected', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const operationButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.querySelector('svg')?.classList.contains('lucide-divide')
    );
    const divideButton = operationButtons[0];
    fireEvent.click(divideButton);

    const startButton = screen.getByText('Start Practice');
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalledWith({
      digitCount: 3,
      divisorDigits: 1,
      operations: 'divide',
      numberCount: 2,
      gameType: 'flash',
      delay: 1000,
      numberOfQuestions: 5,
    });
  });

  it('disables number count buttons when divide selected', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const operationButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.querySelector('svg')?.classList.contains('lucide-divide')
    );
    const divideButton = operationButtons[0];
    fireEvent.click(divideButton);

    const minusButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.querySelector('svg')?.classList.contains('lucide-minus')
    );
    const plusButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.querySelector('svg')?.classList.contains('lucide-plus')
    );

    expect(minusButtons[0]).toBeDisabled();
    expect(plusButtons[0]).toBeDisabled();
  });

  it('changes number of questions with buttons', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const regularButton = screen.getByText('Regular');
    fireEvent.click(regularButton);

    const plusButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.querySelector('svg')?.classList.contains('lucide-plus')
    );
    const plusButton = plusButtons[1]; // Second plus button for questions
    fireEvent.click(plusButton);

    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('calls onStart with correct settings when start clicked', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const startButton = screen.getByText('Start Practice');
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalledWith({
      digitCount: 3,
      operations: 'add-subtract',
      numberCount: 5,
      gameType: 'flash',
      delay: 1000,
      numberOfQuestions: 5,
    });
  });

  it('calls onStart with divide settings', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const operationButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.querySelector('svg')?.classList.contains('lucide-divide')
    );
    const divideButton = operationButtons[0];
    fireEvent.click(divideButton);

    const startButton = screen.getByText('Start Practice');
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalledWith({
      digitCount: 3,
      divisorDigits: 1,
      operations: 'divide',
      numberCount: 2,
      gameType: 'flash',
      delay: 1000,
      numberOfQuestions: 5,
    });
  });

  it('calls onStart with multiply settings', () => {
    render(<CustomPractice onStart={mockOnStart} />);

    const operationButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.querySelector('svg')?.classList.contains('lucide-x')
    );
    const multiplyButton = operationButtons[0];
    fireEvent.click(multiplyButton);

    const startButton = screen.getByText('Start Practice');
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalledWith({
      digitCount: 3,
      operations: 'multiply',
      numberCount: 5,
      gameType: 'flash',
      delay: 1000,
      numberOfQuestions: 5,
    });
  });
});