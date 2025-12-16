import { create } from 'zustand';
import ApiURL from '../utils/apiurl';
import api from '../utils/api';

export interface ITournamentGame {
  id: string;
  name: string;
  planet: string;
  digitCount: number;
  operations: ('add' | 'subtract' | 'multiply' | 'divide')[];
  numberCount: number;
  delay: number;
  color: string;
  icon: string;
}

export interface IUseGameStore {
  tournametGames: ITournamentGame[] | null;
  selectedTournamentGame: ITournamentGame | null;
  error: string | null;
  loading: boolean;
  fetchTournamentGames: () => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedTournamentGame: (tournament: ITournamentGame) => void;
}

export const useGameStore = create<IUseGameStore>(set => ({
  tournametGames: null,
  selectedTournamentGame: null,
  error: null,
  loading: false,
  fetchTournamentGames: async () => {
    set({ loading: true, error: null });
    try {
      const reult = await api.get(ApiURL.game.fetchTournamentGame);
      set({ tournametGames: reult.data, loading: false });
    } catch {
      set({ error: 'Failed to fetch report', loading: false });
    }
    return;
  },
  setSelectedTournamentGame: (tournament: ITournamentGame) => {
    set({ selectedTournamentGame: tournament });
  },
}));
