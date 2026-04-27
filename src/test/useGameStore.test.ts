import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore';
import api from '../utils/api';
import ApiURL from '../utils/apiurl';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('useGameStore', () => {
  const mockedApi = vi.mocked(api, true);

  beforeEach(() => {
    useGameStore.setState({
      flashGameLevels: null,
      flashGameLevelsLoading: false,
      flashGameLevelsError: null,
      regularGameLevels: null,
      regularGameLevelsLoading: false,
      regularGameLevelsError: null,
      selectedGame: null,
      game: null,
      gameLoading: false,
      gameError: null,
    });
    vi.clearAllMocks();
  });

  it('sets selected game in state', () => {
    const game = { id: '1', name: 'Test Game', type: 'flash' };

    useGameStore.getState().setSelectedGame(game);

    expect(useGameStore.getState().selectedGame).toEqual(game);
  });

  it('fetches flash game levels successfully', async () => {
    const mockData = [{ id: 'flash-1', name: 'Flash Level 1' }];
    mockedApi.get.mockResolvedValue({ data: mockData });

    await useGameStore.getState().fetchFlashGameLevels('ADDSUB_L1');

    expect(mockedApi.get).toHaveBeenCalledWith(`${ApiURL.game.fetchGameLevels}/ADDSUB_L1`);
    expect(useGameStore.getState().flashGameLevels).toEqual(mockData);
    expect(useGameStore.getState().flashGameLevelsLoading).toBe(false);
    expect(useGameStore.getState().flashGameLevelsError).toBeNull();
  });

  it('handles flash game levels fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network failed'));

    await useGameStore.getState().fetchFlashGameLevels('ADDSUB_L1');

    expect(useGameStore.getState().flashGameLevelsLoading).toBe(false);
    expect(useGameStore.getState().flashGameLevelsError).toBe('failed to fetch game levels');
  });

  it('returns error when fetching a game without selectedGame', async () => {
    await useGameStore.getState().fetchGame();

    expect(useGameStore.getState().gameError).toBe('No game selected');
    expect(useGameStore.getState().gameLoading).toBe(false);
  });

  it('fetches a normal game when selectedGame is present', async () => {
    useGameStore.setState({ selectedGame: { id: '1', name: 'Regular Game', type: 'regular' } });
    const mockedGameResponse = { data: { questions: [{ id: 1, question: '1+1', answer: '2' }] } };
    mockedApi.post.mockResolvedValue(mockedGameResponse);

    await useGameStore.getState().fetchGame();

    expect(mockedApi.post).toHaveBeenCalledWith(`${ApiURL.game.fetchGame}`, { id: '1', name: 'Regular Game', type: 'regular' });
    expect(useGameStore.getState().game).toEqual(mockedGameResponse.data);
    expect(useGameStore.getState().gameLoading).toBe(false);
    expect(useGameStore.getState().gameError).toBeNull();
  });

  it('fetches a custom game when selectedGame id is custom', async () => {
    const customGame = { id: 'custom', name: 'Custom Practice', type: 'flash' };
    useGameStore.setState({ selectedGame: customGame });
    const mockedGameResponse = { data: { questions: [{ id: 1, question: '2+2', answer: '4' }] } };
    mockedApi.post.mockResolvedValue(mockedGameResponse);

    await useGameStore.getState().fetchGame();

    expect(mockedApi.post).toHaveBeenCalledWith(`${ApiURL.game.fetchCustomGame}`, customGame);
    expect(useGameStore.getState().game).toEqual(mockedGameResponse.data);
    expect(useGameStore.getState().gameError).toBeNull();
  });
});