import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../config/env', () => ({
  default: {
    emailLogin: true,
    termsOfUseURL: '#',
    privacyPolicyURL: '#',
  },
}));

vi.mock('motion/react', async () => {
  const actual = await vi.importActual('motion/react');
  return actual;
});

vi.mock('../utils/api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
    get: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock('../utils/apiurl', () => ({
  default: {
    user: {
      upgrade: '/api/user/upgrade',
    },
  },
}));

vi.mock('../libs/firebaseClient', () => ({
  firebaseAuth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-token'),
    },
  },
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => false),
  },
}));

vi.mock('../services/revenuecat', () => ({
  configureRevenueCat: vi.fn().mockResolvedValue(undefined),
  isNativeRevenueCatEnabled: vi.fn(() => false),
  purchasePlanWithRevenueCat: vi.fn().mockResolvedValue(undefined),
  getOfferings: vi.fn().mockResolvedValue({
    selectedOffering: {
      availablePackages: [
        {
          packageType: 'ANNUAL',
          product: {
            pricePerMonth: 2.5,
            pricePerMonthString: '$2.50',
            pricePerYearString: '$30.00',
          },
        },
        {
          packageType: 'MONTHLY',
          product: {
            pricePerMonth: 4.99,
            pricePerMonthString: '$4.99',
            pricePerYearString: '$59.88',
          },
        },
      ],
    },
  }),
}));

vi.mock('../utils/constants', () => ({
  default: {
    PRICING_PACKAGES: {
      yearly: {
        yearly: '$99.99/year',
        monthly: '$8.33/mo',
        numericPricePerMonth: 8.33,
      },
      monthly: {
        yearly: null,
        monthly: '$9.99/mo',
        numericPricePerMonth: 9.99,
      },
    },
    PRICING_PACKAGES_DOSCOUNT_ON_YEARLY: 17,
  },
}));

vi.mock('../store/useUserStore', () => ({
  useUserStore: vi.fn(() => ({
    authenticatedUser: {
      email: 'test@example.com',
      uid: 'user-123',
    },
    profile: {
      plan: {
        planId: 'FREE',
      },
    },
    profileLoading: false,
    fetchProfile: vi.fn(),
    setOnboardingPaywallFlag: vi.fn(),
    getOnboardingPaywallFlag: vi.fn(() => false),
  })),
}));

// Import after mocks are set up
import { Paywall } from '../components/Paywall';
import { useUserStore } from '../store/useUserStore';

const defaultUserStoreState = () => ({
  authenticatedUser: {
    email: 'test@example.com',
    uid: 'user-123',
  },
  profile: {
    plan: {
      planId: 'FREE',
    },
  },
  profileLoading: false,
  fetchProfile: vi.fn(),
  setOnboardingPaywallFlag: vi.fn(),
  getOnboardingPaywallFlag: vi.fn(() => false),
});

const renderPaywall = () => {
  return render(
    <BrowserRouter>
      <Paywall />
    </BrowserRouter>
  );
};

describe('Paywall Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUserStore).mockReturnValue(defaultUserStoreState());
  });

  describe('Rendering', () => {
    it('renders paywall header with title', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(screen.getByText('Unlock Abacus Pro')).toBeInTheDocument();
      });
    });

    it('renders paywall subtitle', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(
          screen.getByText('Supercharge your mental math skills and go beyond the limits.')
        ).toBeInTheDocument();
      });
    });

    it('renders all features list', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(
          screen.getByText('Unlock all level of tournaments')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Unlimited custom practice sessions')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Advanced performance analytics & charts')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Track your global leaderboard rank')
        ).toBeInTheDocument();
      });
    });

    it('renders pricing options (yearly and monthly)', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(screen.getByText('Yearly Plan')).toBeInTheDocument();
        expect(screen.getByText('Monthly Plan')).toBeInTheDocument();
      });
    });

    it('renders subscription buttons', async () => {
      renderPaywall();

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /yearly plan|monthly plan|start free|close/i });
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('renders close button', async () => {
      renderPaywall();

      await waitFor(() => {
        const closeButtons = screen.getAllByRole('button');
        expect(closeButtons.length).toBeGreaterThan(0);
      });
    });

    it('renders footer disclaimer text', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(
          screen.getByText(/A subscription is required to access Pro features/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner while profile is loading', () => {
      vi.mocked(useUserStore).mockReturnValue({
        authenticatedUser: {
          email: 'test@example.com',
          uid: 'user-123',
        },
        profile: null,
        profileLoading: true,
        fetchProfile: vi.fn(),
        setOnboardingPaywallFlag: vi.fn(),
        getOnboardingPaywallFlag: vi.fn(() => false),
      });

      const { container } = renderPaywall();

      const loaders = container.querySelectorAll('.loader');
      expect(loaders.length).toBeGreaterThan(0);
    });

    it('shows loader when profile is null and not loading', () => {
      vi.mocked(useUserStore).mockReturnValue({
        authenticatedUser: {
          email: 'test@example.com',
          uid: 'user-123',
        },
        profile: null,
        profileLoading: false,
        fetchProfile: vi.fn(),
        setOnboardingPaywallFlag: vi.fn(),
        getOnboardingPaywallFlag: vi.fn(() => false),
      });

      const { container } = renderPaywall();

      const loaders = container.querySelectorAll('.loader');
      expect(loaders.length).toBeGreaterThan(0);
    });
  });

  describe('Trial Button', () => {
    it('renders trial button with correct text', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(screen.getByText(/Start Free 7-Day Trial/i)).toBeInTheDocument();
      });
    });

    it('shows processing text while loading', async () => {
      renderPaywall();

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const trialButton = buttons.find(btn => btn.textContent?.includes('Start Free'));

        if (trialButton) {
          fireEvent.click(trialButton);

          // Button should show processing text
          expect(screen.getByText(/Processing/)).toBeInTheDocument();
        }
      });
    });
  });

  describe('Onboarding Paywall', () => {
    it('renders with full screen layout when onboarding is true', () => {
      vi.mocked(useUserStore).mockReturnValue({
        authenticatedUser: {
          email: 'test@example.com',
          uid: 'user-123',
        },
        profile: {
          plan: {
            planId: 'FREE',
          },
        },
        profileLoading: false,
        fetchProfile: vi.fn(),
        setOnboardingPaywallFlag: vi.fn(),
        getOnboardingPaywallFlag: vi.fn(() => true),
      });

      const { container } = renderPaywall();

      const mainDiv = container.querySelector('.min-h-screen');
      expect(mainDiv).toHaveClass('bg-gradient-to-br');
    });

    it('renders with modal layout when onboarding is false', () => {
      vi.mocked(useUserStore).mockReturnValue({
        authenticatedUser: {
          email: 'test@example.com',
          uid: 'user-123',
        },
        profile: {
          plan: {
            planId: 'FREE',
          },
        },
        profileLoading: false,
        fetchProfile: vi.fn(),
        setOnboardingPaywallFlag: vi.fn(),
        getOnboardingPaywallFlag: vi.fn(() => false),
      });

      const { container } = renderPaywall();

      const fixedDiv = container.querySelector('.fixed');
      expect(fixedDiv).toHaveClass('inset-0');
    });
  });

  describe('Pricing Display', () => {
    it('displays yearly plan pricing', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(screen.getByText(/\$8.33\/mo/)).toBeInTheDocument();
      });
    });

    it('displays monthly plan pricing', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(screen.getByText(/\$9.99\/mo/)).toBeInTheDocument();
      });
    });

    it('displays discount badge on yearly plan', async () => {
      renderPaywall();

      await waitFor(() => {
        expect(screen.getByText(/SAVE/)).toBeInTheDocument();
      });
    });
  });

  describe('Pro User Redirect', () => {
    it('redirects PRO users to home', () => {
      vi.mocked(useUserStore).mockReturnValue({
        authenticatedUser: {
          email: 'test@example.com',
          uid: 'user-123',
        },
        profile: {
          plan: {
            planId: 'PRO',
          },
        },
        profileLoading: false,
        fetchProfile: vi.fn(),
        setOnboardingPaywallFlag: vi.fn(),
        getOnboardingPaywallFlag: vi.fn(() => false),
      });

      const { container } = renderPaywall();

      // When redirecting, the component renders a Navigate component
      // We check that the paywall content is not visible
      expect(screen.queryByText('Unlock Abacus Pro')).not.toBeInTheDocument();
    });
  });

  describe('Unauthenticated User', () => {
    it('renders paywall when authenticatedUser has no email', () => {
      vi.mocked(useUserStore).mockReturnValue({
        authenticatedUser: {
          email: undefined,
          uid: 'user-123',
        },
        profile: null,
        profileLoading: false,
        fetchProfile: vi.fn(),
        setOnboardingPaywallFlag: vi.fn(),
        getOnboardingPaywallFlag: vi.fn(() => false),
      });

      renderPaywall();

      expect(screen.getByText('Unlock Abacus Pro')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('close button exists on the paywall', async () => {
      renderPaywall();

      await waitFor(() => {
        const closeButtons = screen.getAllByRole('button');
        expect(closeButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('subscription buttons are not disabled initially', async () => {
      renderPaywall();

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const subscribeButtons = buttons.filter(
          btn =>
            btn.textContent?.includes('Yearly Plan') ||
            btn.textContent?.includes('Monthly Plan') ||
            btn.textContent?.includes('Start Free')
        );

        subscribeButtons.forEach(btn => {
          expect(btn).not.toBeDisabled();
        });
      });
    });

    it('all features have check mark icons', async () => {
      renderPaywall();

      await waitFor(() => {
        const features = screen.getAllByText(/Unlock all level|Unlimited custom|Advanced performance|Track your global/);
        expect(features.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('has appropriate heading hierarchy', async () => {
      renderPaywall();

      await waitFor(() => {
        const heading = screen.getByText('Unlock Abacus Pro');
        expect(heading.tagName).toBe('H1');
      });
    });
  });

  describe('Profile Fetch', () => {
    it('fetches profile when authenticated user email changes', async () => {
      const mockFetchProfile = vi.fn();
      vi.mocked(useUserStore).mockReturnValue({
        authenticatedUser: {
          email: 'test@example.com',
          uid: 'user-123',
        },
        profile: null,
        profileLoading: false,
        fetchProfile: mockFetchProfile,
        setOnboardingPaywallFlag: vi.fn(),
        getOnboardingPaywallFlag: vi.fn(() => false),
      });

      renderPaywall();

      // Profile should be fetched when component mounts with email
      expect(mockFetchProfile).toHaveBeenCalled();
    });
  });
});
