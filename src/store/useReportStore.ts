import { create } from 'zustand';
import ApiURL from '../utils/apiurl';
import api from '../utils/api';

export interface IReport {
  sessions: number;
  accuracy: number;
  streak: number;
  achievements: number;
}

export interface IUseReportStore {
  report: IReport | null;
  error: string | null;
  loading: boolean;
  fetchReport: () => void;
}

export const useReportStore = create<IUseReportStore>(set => ({
  report: null,
  error: null,
  loading: false,
  fetchReport: async () => {
    set({ loading: true, error: null });
    try {
      const result = await api.get(ApiURL.report.fetchProgressReport);
      return set({ report: result.data, loading: false });
    } catch {
      return set({ error: 'Failed to fetch report', loading: false });
    }
  },
}));
