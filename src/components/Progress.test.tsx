import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Progress } from './Progress';

const mockFetchBasicReport = vi.fn();
const mockFetchProgressReport = vi.fn();
const mockFetchActivities = vi.fn();
const mockResetActivities = vi.fn();

let basicReport: any = {
  totalSessions: 12,
  accuracyRate: 91,
  currentStreak: 5,
  achievements: [1, 2, 3],
};
let basicReportLoading = false;
let progressReport: any = {
  performanceTrend: [70, 75, 80, 85],
  aiSuggestions: ['Practice multiplication drills twice a week'],
};
let progressReportLoading = false;
let activities: any[] = [
  {
    gameName: 'Regular Game',
    gamePlayedAt: new Date().toISOString(),
    gameType: 'regular',
    correctAnswers: 8,
    wrongAnswers: 2,
    score: 80,
    icon: 1,
  },
];
let activitiesTotalCount = 1;
let activitiesLoading = false;

vi.mock('react-chartjs-2', () => ({
  Line: () => <div>LineChart</div>,
}));

vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../store/useReportStore', () => ({
  useReportStore: () => ({
    basicReport,
    basicReportLoading,
    fetchBasicReport: mockFetchBasicReport,
    progressReport,
    progressReportLoading,
    fetchProgressReport: mockFetchProgressReport,
    activities,
    activitiesTotalCount,
    activitiesLoading,
    fetchActivities: mockFetchActivities,
    resetActivities: mockResetActivities,
  }),
}));

vi.mock('../config/env', () => ({
  default: {
    imageBaseURL: 'https://example.com',
  },
}));

describe('Progress', () => {
  beforeEach(() => {
    mockFetchBasicReport.mockReset();
    mockFetchProgressReport.mockReset();
    mockFetchActivities.mockReset();
    mockResetActivities.mockReset();

    basicReport = {
      totalSessions: 12,
      accuracyRate: 91,
      currentStreak: 5,
      achievements: [1, 2, 3],
    };
    basicReportLoading = false;
    progressReport = {
      performanceTrend: [70, 75, 80, 85],
      aiSuggestions: ['Practice multiplication drills twice a week'],
    };
    progressReportLoading = false;
    activities = [
      {
        gameName: 'Regular Game',
        gamePlayedAt: new Date().toISOString(),
        gameType: 'regular',
        correctAnswers: 8,
        wrongAnswers: 2,
        score: 80,
        icon: 1,
      },
    ];
    activitiesTotalCount = 1;
    activitiesLoading = false;
  });

  it('fetches progress data on mount', async () => {
    render(<Progress />);

    await waitFor(() => {
      expect(mockResetActivities).toHaveBeenCalledTimes(1);
      expect(mockFetchBasicReport).toHaveBeenCalledTimes(1);
      expect(mockFetchProgressReport).toHaveBeenCalledTimes(1);
      expect(mockFetchActivities).toHaveBeenCalledWith(0);
    });
  });

  it('renders report stats, chart placeholder, activity item, and AI suggestion', () => {
    render(<Progress />);

    expect(screen.getByText('Your Progress')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('91%')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('LineChart')).toBeInTheDocument();
    expect(screen.getByText('Regular Game')).toBeInTheDocument();
    expect(screen.getByText('AI Suggestion')).toBeInTheDocument();
    expect(screen.getByText('Practice multiplication drills twice a week')).toBeInTheDocument();
  });

  it('shows no activity placeholder when there are no activities', () => {
    activities = [];
    activitiesTotalCount = 0;

    render(<Progress />);

    expect(screen.getByText('No activities yet')).toBeInTheDocument();
  });

  it('does not render the chart while report data is still loading', () => {
    basicReportLoading = true;
    progressReportLoading = true;
    render(<Progress />);

    expect(screen.queryByText('LineChart')).not.toBeInTheDocument();
  });
});
