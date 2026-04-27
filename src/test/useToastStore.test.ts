import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToastStore } from '../store/useToastStore';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({
      message: null,
      type: 'info',
      isVisible: false,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows toast with provided message and type', () => {
    useToastStore.getState().showToast('Hello', 'success');

    expect(useToastStore.getState().message).toBe('Hello');
    expect(useToastStore.getState().type).toBe('success');
    expect(useToastStore.getState().isVisible).toBe(true);
  });

  it('hides toast automatically after timeout', () => {
    useToastStore.getState().showToast('Auto hide');

    expect(useToastStore.getState().isVisible).toBe(true);

    vi.runAllTimers();

    expect(useToastStore.getState().isVisible).toBe(false);
  });

  it('hides toast when hideToast is called', () => {
    useToastStore.setState({ isVisible: true });

    useToastStore.getState().hideToast();

    expect(useToastStore.getState().isVisible).toBe(false);
  });
});
