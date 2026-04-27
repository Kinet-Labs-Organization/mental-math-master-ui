import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Paywall } from "./Paywall";

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
      isNativePlatform: () => false,
    },
  };
});

vi.mock("../libs/firebaseClient", () => ({
  firebaseAuth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue("fake-token"),
    },
  },
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
    mocks.fetchProfile.mockReset();
    mocks.setOnboardingPaywallFlag.mockReset();
    mocks.getOnboardingPaywallFlag.mockReset();
    mocks.navigate.mockReset();
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
});
