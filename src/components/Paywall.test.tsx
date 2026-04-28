import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Paywall } from "./Paywall";

const mockApiPost = vi.hoisted(() => vi.fn().mockResolvedValue({ data: { success: true } }));
const mockGetIdToken = vi.hoisted(() => vi.fn().mockResolvedValue("fake-token"));
const mockIsNativePlatform = vi.hoisted(() => vi.fn(() => false));
const mockConfigureRevenueCat = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockIsNativeRevenueCatEnabled = vi.hoisted(() => vi.fn(() => false));
const mockPurchasePlanWithRevenueCat = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockGetOfferings = vi.hoisted(() =>
  vi.fn().mockResolvedValue({
    selectedOffering: {
      availablePackages: [
        {
          packageType: "ANNUAL",
          product: {
            pricePerMonth: 2.5,
            pricePerMonthString: "$2.50",
            pricePerYearString: "$30.00",
          },
        },
        {
          packageType: "MONTHLY",
          product: {
            pricePerMonth: 4.99,
            pricePerMonthString: "$4.99",
            pricePerYearString: "$59.88",
          },
        },
      ],
    },
  })
);

const mocks = {
  fetchProfile: vi.fn(),
  setOnboardingPaywallFlag: vi.fn(),
  getOnboardingPaywallFlag: vi.fn(),
  navigate: vi.fn(),
};

let userStoreState: any = {
  authenticatedUser: { email: "test@example.com" },
  profile: { plan: { planId: "FREE" } },
  profileLoading: false,
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    Navigate: ({ to }: any) => <div>Navigate to {to}</div>,
  };
});

vi.mock("../store/useUserStore", () => ({
  useUserStore: () => ({
    ...userStoreState,
    fetchProfile: mocks.fetchProfile,
    setOnboardingPaywallFlag: mocks.setOnboardingPaywallFlag,
    getOnboardingPaywallFlag: mocks.getOnboardingPaywallFlag,
  }),
}));

vi.mock("@capacitor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@capacitor/core")>();
  return {
    ...actual,
    Capacitor: {
      ...actual.Capacitor,
      isNativePlatform: mockIsNativePlatform,
    },
  };
});

vi.mock("../libs/firebaseClient", () => ({
  firebaseAuth: {
    currentUser: {
      getIdToken: mockGetIdToken,
    },
  },
}));

vi.mock("../utils/api", () => ({
  default: {
    post: mockApiPost,
  },
}));

vi.mock("../utils/apiurl", () => ({
  default: {
    user: {
      upgrade: "/api/user/upgrade",
    },
  },
}));

vi.mock("../services/revenuecat", () => ({
  configureRevenueCat: mockConfigureRevenueCat,
  isNativeRevenueCatEnabled: mockIsNativeRevenueCatEnabled,
  purchasePlanWithRevenueCat: mockPurchasePlanWithRevenueCat,
  getOfferings: mockGetOfferings,
}));

vi.mock("../utils/constants", () => ({
  default: {
    PRICING_PACKAGES: {
      yearly: { yearly: "$120", monthly: "$10/mo", numericPricePerMonth: 10 },
      monthly: { yearly: "$60", monthly: "$6/mo", numericPricePerMonth: 6 },
    },
    PRICING_PACKAGES_DOSCOUNT_ON_YEARLY: 20,
  },
}));

describe("Paywall", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchProfile.mockReset();
    mocks.setOnboardingPaywallFlag.mockReset();
    mocks.getOnboardingPaywallFlag.mockReset();
    mocks.navigate.mockReset();
    mockApiPost.mockResolvedValue({ data: { success: true } });
    mockGetIdToken.mockResolvedValue("fake-token");
    mockIsNativePlatform.mockReturnValue(false);
    mockConfigureRevenueCat.mockResolvedValue(undefined);
    mockIsNativeRevenueCatEnabled.mockReturnValue(false);
    mockPurchasePlanWithRevenueCat.mockResolvedValue(undefined);
    mockGetOfferings.mockResolvedValue({
      selectedOffering: {
        availablePackages: [
          {
            packageType: "ANNUAL",
            product: {
              pricePerMonth: 2.5,
              pricePerMonthString: "$2.50",
              pricePerYearString: "$30.00",
            },
          },
          {
            packageType: "MONTHLY",
            product: {
              pricePerMonth: 4.99,
              pricePerMonthString: "$4.99",
              pricePerYearString: "$59.88",
            },
          },
        ],
      },
    });
    vi.spyOn(window, "alert").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    userStoreState = {
      authenticatedUser: { email: "test@example.com" },
      profile: { plan: { planId: "FREE" } },
      profileLoading: false,
    };
  });

  it("renders paywall content with web pricing", async () => {
    render(<Paywall />);

    await screen.findByText("Unlock Abacus Pro");
    const yearlyHeading = await screen.findByText("Yearly Plan");
    const monthlyHeading = await screen.findByText("Monthly Plan");
    await screen.findByText(/SAVE 20%/i);

    expect(yearlyHeading.closest("button")).toHaveTextContent(/\$10\/mo/);
    expect(monthlyHeading.closest("button")).toHaveTextContent(/\$6\/mo/);
    await screen.findByRole("button", { name: /Start Free 7-Day Trial/i });
  });

  it("navigates home when onboarding paywall is active and close button is clicked", async () => {
    mocks.getOnboardingPaywallFlag.mockReturnValue(true);

    const { container } = render(<Paywall />);
    const closeButton = container.querySelector("button");
    expect(closeButton).toBeTruthy();

    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(mocks.setOnboardingPaywallFlag).toHaveBeenCalledTimes(1);
    expect(mocks.navigate).toHaveBeenCalledWith("/");
  });

  it("navigates back when modal paywall close button is clicked", () => {
    mocks.getOnboardingPaywallFlag.mockReturnValue(false);

    const { container } = render(<Paywall />);
    const closeButton = container.querySelector("button");
    expect(closeButton).toBeTruthy();

    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(mocks.setOnboardingPaywallFlag).toHaveBeenCalledTimes(1);
    expect(mocks.navigate).toHaveBeenCalledWith(-1);
  });

  it("shows loader while profile is still loading", () => {
    userStoreState = {
      authenticatedUser: { email: "test@example.com" },
      profile: null,
      profileLoading: true,
    };

    const { container } = render(<Paywall />);
    expect(container.querySelector(".loader")).toBeInTheDocument();
    expect(screen.queryByText("Unlock Abacus Pro")).not.toBeInTheDocument();
  });

  it("requests profile data when authenticated user has no profile", () => {
    userStoreState = {
      authenticatedUser: { email: "test@example.com" },
      profile: null,
      profileLoading: false,
    };

    render(<Paywall />);
    expect(mocks.fetchProfile).toHaveBeenCalledTimes(1);
  });

  it("does not request profile data again while profile is already loading", () => {
    userStoreState = {
      authenticatedUser: { email: "test@example.com" },
      profile: null,
      profileLoading: true,
    };

    render(<Paywall />);

    expect(mocks.fetchProfile).not.toHaveBeenCalled();
  });

  it("redirects pro users away from the paywall", () => {
    userStoreState = {
      authenticatedUser: { email: "test@example.com" },
      profile: { plan: { planId: "PRO" } },
      profileLoading: false,
    };

    render(<Paywall />);

    expect(screen.getByText("Navigate to /")).toBeInTheDocument();
    expect(screen.queryByText("Unlock Abacus Pro")).not.toBeInTheDocument();
  });

  it("loads native pricing and calculates the RevenueCat discount", async () => {
    mockIsNativePlatform.mockReturnValue(true);

    render(<Paywall />);

    await waitFor(() => {
      expect(mockConfigureRevenueCat).toHaveBeenCalledWith("test@example.com");
      expect(mockGetOfferings).toHaveBeenCalledTimes(1);
      expect(screen.getByText("$2.50/mo")).toBeInTheDocument();
      expect(screen.getByText("$4.99/mo")).toBeInTheDocument();
      expect(screen.getByText("SAVE 50%")).toBeInTheDocument();
    });
  });

  it("falls back to a zero native discount when monthly pricing is unavailable", async () => {
    mockIsNativePlatform.mockReturnValue(true);
    mockGetOfferings.mockResolvedValue({
      selectedOffering: {
        availablePackages: [
          {
            packageType: "ANNUAL",
            product: {
              pricePerMonth: 2.5,
              pricePerMonthString: "$2.50",
              pricePerYearString: "$30.00",
            },
          },
        ],
      },
    });

    render(<Paywall />);

    await waitFor(() => {
      expect(screen.getByText("SAVE 0%")).toBeInTheDocument();
    });
  });

  it("logs native pricing configuration failures without blocking offerings", async () => {
    mockIsNativePlatform.mockReturnValue(true);
    mockConfigureRevenueCat.mockRejectedValue(new Error("missing key"));

    render(<Paywall />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "RevenueCat configure failed:",
        expect.any(Error)
      );
      expect(screen.getByText("$2.50/mo")).toBeInTheDocument();
    });
  });

  it("subscribes to the yearly web plan and closes the paywall", async () => {
    render(<Paywall />);

    fireEvent.click(await screen.findByRole("button", { name: /Yearly Plan/i }));

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith("/api/user/upgrade", { term: "d365" });
      expect(mockGetIdToken).toHaveBeenCalledWith(true);
      expect(mocks.setOnboardingPaywallFlag).toHaveBeenCalledTimes(1);
      expect(mocks.navigate).toHaveBeenCalledWith(-1);
    });
  });

  it("subscribes to the monthly native plan through RevenueCat first", async () => {
    mockIsNativePlatform.mockReturnValue(true);
    mockIsNativeRevenueCatEnabled.mockReturnValue(true);

    render(<Paywall />);

    fireEvent.click(await screen.findByRole("button", { name: /Monthly Plan/i }));

    await waitFor(() => {
      expect(mockConfigureRevenueCat).toHaveBeenCalledWith("test@example.com");
      expect(mockPurchasePlanWithRevenueCat).toHaveBeenCalledWith("monthly");
      expect(mockApiPost).toHaveBeenCalledWith("/api/user/upgrade", { term: "d30" });
    });
  });

  it("subscribes to the trial web plan with the trial term", async () => {
    render(<Paywall />);

    fireEvent.click(await screen.findByRole("button", { name: /Start Free 7-Day Trial/i }));

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith("/api/user/upgrade", { term: "d7" });
    });
  });

  it("does not subscribe when the user has no email", async () => {
    userStoreState = {
      authenticatedUser: {},
      profile: { plan: { planId: "FREE" } },
      profileLoading: false,
    };

    render(<Paywall />);

    fireEvent.click(await screen.findByRole("button", { name: /Start Free 7-Day Trial/i }));

    expect(mockApiPost).not.toHaveBeenCalled();
    expect(mockPurchasePlanWithRevenueCat).not.toHaveBeenCalled();
  });

  it("shows a configuration error when native RevenueCat is disabled", async () => {
    mockIsNativePlatform.mockReturnValue(true);
    mockIsNativeRevenueCatEnabled.mockReturnValue(false);

    render(<Paywall />);

    fireEvent.click(await screen.findByRole("button", { name: /Start Free 7-Day Trial/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Unable to subscribe: RevenueCat is not configured for this native platform. Please set native RevenueCat API key."
      );
      expect(mockApiPost).not.toHaveBeenCalled();
    });
  });

  it("shows purchase cancelled for cancelled subscription errors", async () => {
    mockApiPost.mockRejectedValue({ code: "1", userCancelled: true });

    render(<Paywall />);

    fireEvent.click(await screen.findByRole("button", { name: /Start Free 7-Day Trial/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Purchase cancelled.");
    });
  });

  it("shows a detailed alert for subscription failures with error codes", async () => {
    mockApiPost.mockRejectedValue({ code: "server_error", message: "Upgrade failed" });

    render(<Paywall />);

    fireEvent.click(await screen.findByRole("button", { name: /Start Free 7-Day Trial/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Unable to subscribe (server_error): Upgrade failed"
      );
    });
  });

  it("falls back to an unknown subscription error message", async () => {
    mockApiPost.mockRejectedValue({});

    render(<Paywall />);

    fireEvent.click(await screen.findByRole("button", { name: /Start Free 7-Day Trial/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Unable to subscribe: Unknown subscription error");
    });
  });
});
