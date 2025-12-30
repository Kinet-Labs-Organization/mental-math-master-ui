import { create } from "zustand";
import ApiURL from "../utils/apiurl";
import api from "../utils/api";

export interface IReport {
  sessions: number;
  accuracy: number;
  streak: number;
  achievements: number;
}

export interface IUseReportStore {
  report: IReport | null;
  reportLoading: boolean;
  reportError: string | null;
  fetchReport: () => void;
}

export const useReportStore = create<IUseReportStore>((set) => ({
  report: null,
  reportLoading: false,
  reportError: null,
  fetchReport: async () => {
    set({ reportLoading: true, reportError: null });
    try {
      const result = await api.get(ApiURL.report.fetchProgressReport);
      return set({ report: result.data, reportLoading: false });
    } catch {
      return set({ reportLoading: false, reportError: "Failed to fetch report" });
    }
  },
}));
