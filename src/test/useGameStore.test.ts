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
      score: 0,
      answers: [],
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

  it('fetches regular game levels successfully', async () => {
    const mockData = [{ id: 'regular-1', name: 'Regular Level 1' }];
    mockedApi.get.mockResolvedValue({ data: mockData });

    await useGameStore.getState().fetchRegularGameLevels('MULDIV_L1');

    expect(mockedApi.get).toHaveBeenCalledWith(`${ApiURL.game.fetchGameLevels}/MULDIV_L1`);
    expect(useGameStore.getState().regularGameLevels).toEqual(mockData);
    expect(useGameStore.getState().regularGameLevelsLoading).toBe(false);
    expect(useGameStore.getState().regularGameLevelsError).toBeNull();
  });

  it('sets regular game level error when regular levels fetch fails', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network failed'));

    await useGameStore.getState().fetchRegularGameLevels('MULDIV_L1');

    expect(useGameStore.getState().regularGameLevelsLoading).toBe(false);
    expect(useGameStore.getState().regularGameLevelsError).toBe('failed to fetch game levels');
  });

  it('sets loading flags while fetching level data', () => {
    let resolveRequest: (value: { data: any[] }) => void = () => undefined;
    mockedApi.get.mockReturnValue(
      new Promise(resolve => {
        resolveRequest = resolve;
      }) as any
    );

    const request = useGameStore.getState().fetchFlashGameLevels('ADDSUB_L2');

    expect(useGameStore.getState().flashGameLevelsLoading).toBe(true);
    expect(useGameStore.getState().flashGameLevelsError).toBeNull();

    resolveRequest({ data: [] });
    return request;
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

  it('sets game data directly with setGame', () => {
    const gameData = [{ value: 12, operation: 'add' }];

    useGameStore.getState().setGame(gameData);

    expect(useGameStore.getState().game).toEqual(gameData);
  });

  it('sets game error when game fetch fails', async () => {
    const game = { id: '1', name: 'Regular Game', type: 'regular' };
    useGameStore.setState({ selectedGame: game });
    mockedApi.post.mockRejectedValue(new Error('Network failed'));

    await useGameStore.getState().fetchGame();

    expect(mockedApi.post).toHaveBeenCalledWith(`${ApiURL.game.fetchGame}`, game);
    expect(useGameStore.getState().gameLoading).toBe(false);
    expect(useGameStore.getState().gameError).toBe('Failed to fetch game');
  });

  it('sets game loading while fetching a game', () => {
    const game = { id: '1', name: 'Regular Game', type: 'regular' };
    useGameStore.setState({ selectedGame: game });
    let resolveRequest: (value: { data: any[] }) => void = () => undefined;
    mockedApi.post.mockReturnValue(
      new Promise(resolve => {
        resolveRequest = resolve;
      }) as any
    );

    const request = useGameStore.getState().fetchGame();

    expect(useGameStore.getState().gameLoading).toBe(true);
    expect(useGameStore.getState().gameError).toBeNull();

    resolveRequest({ data: [] });
    return request;
  });

  it('increments from fallback score and appends to fallback answers', () => {
    useGameStore.setState({ score: undefined, answers: undefined });

    useGameStore.getState().incrementScore(3);
    useGameStore.getState().addAnswer({ id: 1, answer: '42' });

    expect(useGameStore.getState().score).toBe(3);
    expect(useGameStore.getState().answers).toEqual([{ id: 1, answer: '42' }]);
  });
});
