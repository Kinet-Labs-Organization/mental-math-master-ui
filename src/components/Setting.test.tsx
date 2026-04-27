import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Setting } from './Setting';

const mocks = {
  fetchSettingsData: vi.fn(),
  updateSettings: vi.fn(),
  removeAuthenticatedUser: vi.fn(),
  fetchFaqs: vi.fn(),
  showToast: vi.fn(),
  signOutFromFirebase: vi.fn().mockResolvedValue(undefined),
};

let settingsData: any = {
  soundEffect: true,
  notifications: false,
  newsLetter: true,
};

let faqs: any[] = [
  { question: 'How do I reset progress?', answer: 'Use the clear data button.' },
  { question: 'How do I contact support?', answer: 'Email mastermentalmath@gmail.com.' },
];

vi.mock('../store/useUserStore', () => ({
  useUserStore: () => ({
    removeAuthenticatedUser: mocks.removeAuthenticatedUser,
    settingsData,
    updateSettings: mocks.updateSettings,
    fetchSettingsData: mocks.fetchSettingsData,
  }),
}));

vi.mock('../store/useGenericStore', () => ({
  useGenericStore: () => ({
    faqs,
    faqsLoading: false,
    fetchFaqs: mocks.fetchFaqs,
  }),
}));

vi.mock('../store/useToastStore', () => ({
  useToastStore: () => ({
    showToast: mocks.showToast,
  }),
}));

vi.mock('../libs/firebaseClient', () => ({
  signOutFromFirebase: mocks.signOutFromFirebase,
}));

describe('Setting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    settingsData = {
      soundEffect: true,
      notifications: false,
      newsLetter: true,
    };
    faqs = [
      { question: 'How do I reset progress?', answer: 'Use the clear data button.' },
      { question: 'How do I contact support?', answer: 'Email mastermentalmath@gmail.com.' },
    ];
  });

  it('fetches settings and FAQs on mount', async () => {
    render(<Setting />);

    await waitFor(() => {
      expect(mocks.fetchSettingsData).toHaveBeenCalledTimes(1);
      expect(mocks.fetchFaqs).toHaveBeenCalledTimes(1);
    });
  });

  it('toggles a preference and updates settings', () => {
    render(<Setting />);

    const soundSection = screen.getByText('Sound Effects').closest('div');
    expect(soundSection).toBeTruthy();

    const toggleButton = soundSection?.querySelector('button');
    expect(toggleButton).toBeTruthy();

    if (toggleButton) {
      fireEvent.click(toggleButton);
    }

    expect(mocks.updateSettings).toHaveBeenCalledWith({ sound: false });
  });

  it('opens the FAQ popup and shows questions', async () => {
    render(<Setting />);

    fireEvent.click(screen.getByText('FAQ'));

    expect(await screen.findByText('How do I reset progress?')).toBeInTheDocument();
    expect(screen.getByText('How do I contact support?')).toBeInTheDocument();
  });

  it('opens the support popup and shows contact email', async () => {
    render(<Setting />);

    fireEvent.click(screen.getByText('Support'));

    expect(await screen.findByText(/Contact Support/i)).toBeInTheDocument();
    expect(screen.getByText(/mastermentalmath@gmail.com/i)).toBeInTheDocument();
  });

  it('clears data and shows a success toast', async () => {
    render(<Setting />);

    fireEvent.click(screen.getByText('Clear Data'));
    expect(screen.getByText('Yes, Clear')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Yes, Clear'));

    await waitFor(() => {
      expect(mocks.showToast).toHaveBeenCalledWith('Successfully deleted data', 'success');
    });
  });

  it('signs out and calls firebase sign out', async () => {
    render(<Setting />);

    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(mocks.removeAuthenticatedUser).toHaveBeenCalledTimes(1);
      expect(mocks.signOutFromFirebase).toHaveBeenCalledTimes(1);
    });
  });
});
