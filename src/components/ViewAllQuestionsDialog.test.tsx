import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewAllQuestionsDialog } from './ViewAllQuestionsDialog';

const handleQuestionNavigate = vi.fn();
const handleSubmit = vi.fn();
const isAnswered = vi.fn();

const questions = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

const answers = {
  0: '5',
  1: '',
  2: '',
};

describe('ViewAllQuestionsDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAnswered.mockImplementation((id) => id === 1);
  });

  it('renders dialog content with counts and disabled submit button when not all answered', () => {
    render(
      <ViewAllQuestionsDialog
        questions={questions}
        currentQuestionIndex={0}
        handleQuestionNavigate={handleQuestionNavigate}
        isAnswered={isAnswered}
        answers={answers}
        handleSubmit={handleSubmit}
        allQuestionsAnswered={false}
      />,
    );

    fireEvent.click(screen.getByText('View All'));

    expect(screen.getByText('All Questions')).toBeInTheDocument();
    expect(screen.getByText('Answered (1)')).toBeInTheDocument();
    expect(screen.getByText('Unanswered (2)')).toBeInTheDocument();
    expect(screen.getByText('Answer all questions to submit (1/3)')).toBeInTheDocument();

    fireEvent.click(screen.getByText('2'));
    expect(handleQuestionNavigate).toHaveBeenCalledWith(1);
  });

  it('enables submit button when all questions are answered', () => {
    render(
      <ViewAllQuestionsDialog
        questions={questions}
        currentQuestionIndex={1}
        handleQuestionNavigate={handleQuestionNavigate}
        isAnswered={isAnswered}
        answers={{ 0: '5', 1: '6', 2: '7' }}
        handleSubmit={handleSubmit}
        allQuestionsAnswered={true}
      />,
    );

    fireEvent.click(screen.getByText('View All'));
    const submitButton = screen.getByRole('button', { name: /Submit All Answers/i });

    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
