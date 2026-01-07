import { create } from "zustand";
import ApiURL from "../utils/apiurl";
import api from "../utils/api";

export interface IGame {
  id: string;
  name: string;
  digitCount: number;
  operations: ("add" | "subtract" | "multiply" | "divide")[];
  numberCount: number;
  delay: number;
  // color: string;
  type: string;
  icon: string;
}

export const useGameStore = create<any>((set, get) => ({
  flashGameLevels: null,
  flashGameLevelsLoading: false,
  flashGameLevelsError: null,
  fetchFlashGameLevels: async (gameLevel: string) => {
    set({ flashGameLevelsLoading: true, flashGameLevelsError: null });
    try {
      const reult = await api.get(
        `${ApiURL.game.fetchGameLevels}/${gameLevel}`,
      );
      set({ flashGameLevels: reult.data, flashGameLevelsLoading: false });
    } catch {
      set({
        flashGameLevelsLoading: false,
        flashGameLevelsError: "failed to fetch game levels",
      });
    }
    return;
  },

  regularGameLevels: null,
  regularGameLevelsLoading: false,
  regularGameLevelsError: null,
  fetchRegularGameLevels: async (gameLevel: string) => {
    set({ regularGameLevelsLoading: true, regularGameLevelsError: null });
    try {
      const reult = await api.get(
        `${ApiURL.game.fetchGameLevels}/${gameLevel}`,
      );
      set({ regularGameLevels: reult.data, regularGameLevelsLoading: false });
    } catch {
      set({
        regularGameLevelsLoading: false,
        regularGameLevelsError: "failed to fetch game levels",
      });
    }
    return;
  },

  selectedGame: null,
  setSelectedGame: (game: any) => {
    set({ selectedGame: game });
  },

  game: null,
  gameLoading: false,
  gameError: null,
  setGame: (gameData: any) => set({ game: gameData }),
  fetchGame: async () => {
    set({ gameLoading: true, gameError: null });
    const { selectedGame } = get();
    if (!selectedGame) {
      set({ gameError: "No game selected", gameLoading: false });
      return;
    }
    try {
      let result;
      if(selectedGame.id === 'custom'){
        result = await api.post(
        `${ApiURL.game.fetchCustomGame}`, selectedGame
      );
      } else {
        result = await api.post(
        `${ApiURL.game.fetchGame}`, selectedGame
      );
      }
      set({ game: result.data, gameLoading: false });
    } catch {
      set({ gameError: "Failed to fetch game", gameLoading: false });
    }
  },
}));
