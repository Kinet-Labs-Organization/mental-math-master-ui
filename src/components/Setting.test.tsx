import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Setting } from './Setting';

const fetchSettingsData = vi.hoisted(() => vi.fn());
const updateSettings = vi.hoisted(() => vi.fn());
const removeAuthenticatedUser = vi.hoisted(() => vi.fn());
const fetchFaqs = vi.hoisted(() => vi.fn());
const showToast = vi.hoisted(() => vi.fn());
const signOutFromFirebase = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

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
    removeAuthenticatedUser,
    settingsData,
    updateSettingsData: updateSettings,
    fetchSettingsData,
  }),
}));

vi.mock('../store/useGenericStore', () => ({
  useGenericStore: () => ({
    faqs,
    faqsLoading: false,
    fetchFaqs,
  }),
}));

vi.mock('../store/useToastStore', () => ({
  useToastStore: () => ({
    showToast,
  }),
}));

vi.mock('../libs/firebaseClient', () => ({
  signOutFromFirebase,
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
      expect(fetchSettingsData).toHaveBeenCalledTimes(1);
      expect(fetchFaqs).toHaveBeenCalledTimes(1);
    });
  });

  it('toggles a preference and updates settings', () => {
    render(<Setting />);

    const soundLabel = screen.getByText('Sound Effects');
    const soundItem = soundLabel.closest('div')?.parentElement;
    expect(soundItem).toBeTruthy();

    const toggleButton = soundItem?.querySelector('button');
    expect(toggleButton).toBeTruthy();

    if (toggleButton) {
      fireEvent.click(toggleButton);
    }

    expect(updateSettings).toHaveBeenCalledWith({ sound: false });
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
      expect(showToast).toHaveBeenCalledWith('Successfully deleted data', 'success');
    });
  });

  it('signs out and calls firebase sign out', async () => {
    render(<Setting />);

    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(removeAuthenticatedUser).toHaveBeenCalledTimes(1);
      expect(signOutFromFirebase).toHaveBeenCalledTimes(1);
    });
  });
});
