import { beforeEach, describe, expect, it } from 'vitest';
import { useConfigStore } from '../store/useConfigStore';

describe('useConfigStore', () => {
  beforeEach(() => {
    useConfigStore.setState({
      FooterNavigation: true,
      TopEmptySpace: true,
      BottomEmptySpace: true,
    });
  });

  it('initializes with footer navigation and empty spaces visible', () => {
    const state = useConfigStore.getState();

    expect(state.FooterNavigation).toBe(true);
    expect(state.TopEmptySpace).toBe(true);
    expect(state.BottomEmptySpace).toBe(true);
  });

  it('can hide and show footer navigation', () => {
    const { hideFooterNavigation, showFooterNavigation } = useConfigStore.getState();

    hideFooterNavigation();
    expect(useConfigStore.getState().FooterNavigation).toBe(false);

    showFooterNavigation();
    expect(useConfigStore.getState().FooterNavigation).toBe(true);
  });

  it('can hide and show top empty space', () => {
    const { hideTopEmptySpace, showTopEmptySpace } = useConfigStore.getState();

    hideTopEmptySpace();
    expect(useConfigStore.getState().TopEmptySpace).toBe(false);

    showTopEmptySpace();
    expect(useConfigStore.getState().TopEmptySpace).toBe(true);
  });

  it('can hide and show bottom empty space', () => {
    const { hideBottomEmptySpace, showBottomEmptySpace } = useConfigStore.getState();

    hideBottomEmptySpace();
    expect(useConfigStore.getState().BottomEmptySpace).toBe(false);

    showBottomEmptySpace();
    expect(useConfigStore.getState().BottomEmptySpace).toBe(true);
  });
});
