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

export const useReportStore = create<IUseReportStore>((set, get) => ({
  report: null,
  reportLoading: false,
  reportError: null,
  fetchReport: async () => {
    set({ reportLoading: true, reportError: null });
    try {
      const result = await api.get(ApiURL.user.fetchProgressReport);
      return set({ report: result.data, reportLoading: false });
    } catch {
      return set({
        reportLoading: false,
        reportError: "Failed to fetch report",
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
