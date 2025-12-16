import { create } from 'zustand';

export const useConfigStore = create<any>(set => ({
  FooterNavigation: true,
  TopEmptySpace: true,
  BottomEmptySpace: true,
  showFooterNavigation: () => {
    return set({ FooterNavigation: true });
  },
  hideFooterNavigation: () => {
    return set({ FooterNavigation: false });
  },

  showTopEmptySpace: () => {
    return set({ TopEmptySpace: true });
  },
  hideTopEmptySpace: () => {
    return set({ TopEmptySpace: false });
  },

  showBottomEmptySpace: () => {
    return set({ BottomEmptySpace: true });
  },
  hideBottomEmptySpace: () => {
    return set({ BottomEmptySpace: false });
  },
}));
