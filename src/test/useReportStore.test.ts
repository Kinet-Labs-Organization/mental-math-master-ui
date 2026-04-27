import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReportStore } from '../store/useReportStore';
import api from '../utils/api';
import ApiURL from '../utils/apiurl';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useReportStore', () => {
  const mockedApi = vi.mocked(api, true);

  beforeEach(() => {
    useReportStore.setState({
      basicReport: null,
      basicReportLoading: false,
      basicReportError: null,
      progressReport: null,
      progressReportLoading: false,
      progressReportError: null,
      activities: [],
      activitiesTotalCount: 0,
      activitiesLoading: false,
      activitiesError: null,
    });
    vi.clearAllMocks();
  });

  it('fetches basic report successfully', async () => {
    const mockReport = { totalSessions: 10, accuracyRate: 85 };
    mockedApi.get.mockResolvedValue({ data: mockReport });

    await useReportStore.getState().fetchBasicReport();

    expect(mockedApi.get).toHaveBeenCalledWith(ApiURL.user.fetchBasicReport);
    expect(useReportStore.getState().basicReport).toEqual(mockReport);
    expect(useReportStore.getState().basicReportLoading).toBe(false);
    expect(useReportStore.getState().basicReportError).toBeNull();
  });

  it('handles basic report fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await useReportStore.getState().fetchBasicReport();

    expect(useReportStore.getState().basicReportLoading).toBe(false);
    expect(useReportStore.getState().basicReportError).toBe('Failed to fetch basic report');
  });

  it('fetches progress report successfully', async () => {
    const mockProgress = { performanceTrend: [50, 70, 90] };
    mockedApi.get.mockResolvedValue({ data: mockProgress });

    await useReportStore.getState().fetchProgressReport();

    expect(mockedApi.get).toHaveBeenCalledWith(ApiURL.user.fetchProgressReport);
    expect(useReportStore.getState().progressReport).toEqual(mockProgress);
    expect(useReportStore.getState().progressReportLoading).toBe(false);
    expect(useReportStore.getState().progressReportError).toBeNull();
  });

  it('handles progress report fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Server error'));

    await useReportStore.getState().fetchProgressReport();

    expect(useReportStore.getState().progressReportLoading).toBe(false);
    expect(useReportStore.getState().progressReportError).toBe('Failed to fetch progress report');
  });

  it('resets activity state when resetActivities is called', () => {
    useReportStore.setState({
      activities: [{ id: 1 }],
      activitiesTotalCount: 5,
      activitiesLoading: true,
      activitiesError: 'error',
    });

    useReportStore.getState().resetActivities();

    expect(useReportStore.getState().activities).toEqual([]);
    expect(useReportStore.getState().activitiesTotalCount).toBe(0);
    expect(useReportStore.getState().activitiesLoading).toBe(false);
    expect(useReportStore.getState().activitiesError).toBeNull();
  });

  it('fetches activities successfully and appends results', async () => {
    useReportStore.setState({ activities: [{ id: 1 }], activitiesTotalCount: 1 });
    const activityResponse = { recentActivities: [{ id: 2 }], totalCount: 2 };
    mockedApi.get.mockResolvedValue({ data: activityResponse });

    await useReportStore.getState().fetchActivities(1);

    expect(mockedApi.get).toHaveBeenCalledWith(`${ApiURL.user.fetchActivities}?position=1`);
    expect(useReportStore.getState().activities).toEqual([{ id: 1 }, { id: 2 }]);
    expect(useReportStore.getState().activitiesTotalCount).toBe(2);
    expect(useReportStore.getState().activitiesLoading).toBe(false);
    expect(useReportStore.getState().activitiesError).toBeNull();
  });

  it('handles activity fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Timeout'));

    await useReportStore.getState().fetchActivities(0);

    expect(useReportStore.getState().activitiesLoading).toBe(false);
    expect(useReportStore.getState().activitiesError).toBe('Failed to fetch activities');
  });
});
