import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGenericStore } from '../store/useGenericStore';
import api from '../utils/api';
import ApiURL from '../utils/apiurl';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useGenericStore', () => {
  const mockedApi = vi.mocked(api, true);

  beforeEach(() => {
    useGenericStore.setState({
      faqs: [],
      faqsLoading: false,
      faqsError: null,
      leaderboardData: null,
      leaderboardLoading: false,
      leaderboardError: null,
      blogs: [],
      blogsLoading: false,
      blogsError: null,
    });
    vi.clearAllMocks();
  });

  it('fetches faqs successfully', async () => {
    const mockFaqs = [{ id: 1, question: 'How?', answer: 'Like this.' }];
    mockedApi.get.mockResolvedValue({ data: mockFaqs });

    await useGenericStore.getState().fetchFaqs();

    expect(mockedApi.get).toHaveBeenCalledWith(`${ApiURL.generic.fetchFaqs}`);
    expect(useGenericStore.getState().faqs).toEqual(mockFaqs);
    expect(useGenericStore.getState().faqsLoading).toBe(false);
    expect(useGenericStore.getState().faqsError).toBeNull();
  });

  it('handles faq fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await useGenericStore.getState().fetchFaqs();

    expect(useGenericStore.getState().faqsLoading).toBe(false);
    expect(useGenericStore.getState().faqsError).toBe('failed to fetch faqs');
  });

  it('fetches leaderboard data successfully', async () => {
    const leaderboardData = [{ id: 1, name: 'Player 1', score: 100 }];
    mockedApi.get.mockResolvedValue({ data: leaderboardData });

    await useGenericStore.getState().fetchLeaderboard();

    expect(mockedApi.get).toHaveBeenCalledWith(ApiURL.generic.fetchLeaderboard);
    expect(useGenericStore.getState().leaderboardData).toEqual(leaderboardData);
    expect(useGenericStore.getState().leaderboardLoading).toBe(false);
    expect(useGenericStore.getState().leaderboardError).toBeNull();
  });

  it('handles leaderboard fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Server error'));

    await useGenericStore.getState().fetchLeaderboard();

    expect(useGenericStore.getState().leaderboardLoading).toBe(false);
    expect(useGenericStore.getState().leaderboardError).toBe('failed to fetch leaderboard');
  });

  it('fetches recent blogs successfully with params', async () => {
    const blogs = [{ id: 1, title: 'New Blog' }];
    mockedApi.get.mockResolvedValue({ data: blogs });

    await useGenericStore.getState().fetchBlogs(5);

    expect(mockedApi.get).toHaveBeenCalledWith(`${ApiURL.generic.fetchBlogs}`, { params: { recentMax: 5 } });
    expect(useGenericStore.getState().blogs).toEqual(blogs);
    expect(useGenericStore.getState().blogsLoading).toBe(false);
    expect(useGenericStore.getState().blogsError).toBeNull();
  });

  it('handles blog fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Request failed'));

    await useGenericStore.getState().fetchBlogs(3);

    expect(useGenericStore.getState().blogsLoading).toBe(false);
    expect(useGenericStore.getState().blogsError).toBe('failed to fetch blogs');
  });
});
