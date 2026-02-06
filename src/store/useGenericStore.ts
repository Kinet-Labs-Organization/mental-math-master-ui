import { create } from "zustand";
import ApiURL from "../utils/apiurl";
import api from "../utils/api";

export const useGenericStore = create<any>((set, get) => ({
    faqs: [],
    faqsLoading: false,
    faqsError: null,
    fetchFaqs: async () => {
        set({ faqsLoading: true, faqsError: null });
        try {
            const result = await api.get(`${ApiURL.generic.fetchFaqs}`);
            return set({ faqs: result.data, faqsLoading: false });
        } catch (error) {
            return set({ faqsLoading: false, faqsError: "failed to fetch faqs" });
        }
    },
    leaderboardData: null,
    leaderboardLoading: false,
    leaderboardError: null,
    fetchLeaderboard: async () => {
        set({ leaderboardLoading: true, leaderboardError: null });
        try {
            const result = await api.get(ApiURL.generic.fetchLeaderboard);
            set({ leaderboardData: result.data, leaderboardLoading: false });
        } catch (error) {
            set({ leaderboardLoading: false, leaderboardError: "failed to fetch leaderboard" });
        }
    },
}));
