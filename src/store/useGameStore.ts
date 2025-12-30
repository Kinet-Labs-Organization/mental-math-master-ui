import { create } from "zustand";
import ApiURL from "../utils/apiurl";
import api from "../utils/api";

export interface ITournamentGame {
  id: string;
  name: string;
  // planet: string;
  digitCount: number;
  operations: ("add" | "subtract" | "multiply" | "divide")[];
  numberCount: number;
  delay: number;
  // color: string;
  icon: string;
}

export interface IUseGameStore {
  
  flashGameLevels: ITournamentGame[] | null;
  flashGameLevelsError: string | null;
  flashGameLevelsLoading: boolean;
  fetchFlashGameLevels: (regularGameLevel:string) => void;
  
selectedTournamentGame: ITournamentGame | null;
  
  // eslint-disable-next-line no-unused-vars
  setSelectedTournamentGame: (tournament: ITournamentGame) => void;
  game: any;
  setGame: (game:any) => void;
  fetchGame: () => void;
  gameLoading: boolean;
  gameError: string | null;
}

export const useGameStore = create<any>((set, get) => ({

  flashGameLevels: null,
  flashGameLevelsError: null,
  flashGameLevelsLoading: false,
  fetchFlashGameLevels: async (gameLevel:string) => {
    set({ flashGameLevelsLoading: true, flashGameLevelsError: null });
    try {
      const reult = await api.get(`${ApiURL.game.fetchGameLevels}/${gameLevel}`);
      set({ flashGameLevels: reult.data, flashGameLevelsLoading: false });
    } catch {
      set({ flashGameLevelsLoading: false, flashGameLevelsError: 'failed to fetch game levels' });
    }
    return;
  },

  regularGameLevels: null,
  regularGameLevelsError: null,
  regularGameLevelsLoading: false,
  fetchRegularGameLevels: async (gameLevel:string) => {
    set({ regularGameLevelsLoading: true, regularGameLevelsError: null });
    try {
      const reult = await api.get(`${ApiURL.game.fetchGameLevels}/${gameLevel}`);
      set({ regularGameLevels: reult.data, regularGameLevelsLoading: false });
    } catch {
      set({ regularGameLevelsLoading: false, regularGameLevelsError: 'failed to fetch game levels' });
    }
    return;
  },





  selectedTournamentGame: null,

  setSelectedTournamentGame: (tournament: ITournamentGame) => {
    set({ selectedTournamentGame: tournament });
  },
  game: null,
  gameLoading: false,
  gameError: null,
  setGame: (gameData:any) => set({game: gameData}),
  fetchGame: async () => {
    set({ gameLoading: true, gameError: null });
    const { selectedTournamentGame } = get();
    if (!selectedTournamentGame) {
      set({ gameError: "No tournament selected", gameLoading: false });
      return;
    }
    try {
      console.log(selectedTournamentGame);
      // Placeholder for actual game fetching logic
      const result = await api.get(`${ApiURL.game.fetchGame}/${selectedTournamentGame.id}`);
      set({ game: result.data, gameLoading: false });
    } catch {
      set({ gameError: "Failed to fetch game", gameLoading: false });
    }
  },
}));
