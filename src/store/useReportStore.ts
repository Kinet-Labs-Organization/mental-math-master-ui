import { create } from "zustand";
import ApiURL from "../utils/apiurl";
import api from "../utils/api";

export interface IUseReportStore {
  report: any;
  reportLoading: boolean;
  reportError: string | null;
  fetchReport: () => void;

  activities: any[];
  activitiesLoading: boolean;
  activitiesError: string | null;
  fetchActivities: (position: number) => void;
}

export const useReportStore = create<any>((set, get) => ({

  basicReport: null,
  basicReportLoading: false,
  basicReportError: null,
  fetchBasicReport: async () => {
    set({ basicReportLoading: true, basicReportError: null });
    try {
      const result = await api.get(ApiURL.user.fetchBasicReport);
      return set({ basicReport: result.data, basicReportLoading: false });
    } catch (error) {
      return set({
        basicReportLoading: false,
        basicReportError: "Failed to fetch basic report",
      });
    }
  },

  progressReport: null,
  progressReportLoading: false,
  progressReportError: null,
  fetchProgressReport: async () => {
    set({ progressReportLoading: true, progressReportError: null });
    try {
      const result = await api.get(ApiURL.user.fetchProgressReport);
      return set({ progressReport: result.data, progressReportLoading: false });
    } catch (error) {
      return set({
        progressReportLoading: false,
        progressReportError: "Failed to fetch progress report",
      });
    }
  },

  activities: [],
  activitiesLoading: false,
  activitiesError: null,
  fetchActivities: async (position: number) => {
    set({ activitiesLoading: true, activitiesError: null });
    try {
      const result = await api.get(`${ApiURL.user.fetchActivities}?position=${position}`);
      return set({ activities: [...get().activities, ...result.data], activitiesLoading: false });
    } catch {
      return set({
        activitiesLoading: false,
        activitiesError: "Failed to fetch activities",
      });
    }
  }
}));
