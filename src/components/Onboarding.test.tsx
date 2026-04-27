import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Onboarding } from "./Onboarding";

const mocks = vi.hoisted(() => ({
  setOnboardingFlag: vi.fn(),
  signInWithGoogle: vi.fn(),
}));

vi.mock("../store/useUserStore", () => ({
  useUserStore: {
    getState: () => ({
      setOnboardingFlag: mocks.setOnboardingFlag,
    }),
  },
}));

vi.mock("../libs/firebaseClient", () => ({
  signInWithGoogle: mocks.signInWithGoogle,
}));

describe("Onboarding", () => {
  beforeEach(() => {
    mocks.setOnboardingFlag.mockReset();
    mocks.signInWithGoogle.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("moves from question to result and then to mastery step", async () => {
    const user = userEvent.setup();
    render(<Onboarding />);

    await user.type(screen.getByPlaceholderText("Enter your answer"), "25");
    await user.click(screen.getByRole("button", { name: "Submit Answer" }));

    expect(await screen.findByText("Amazing!")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText("Your Path to Mastery")).toBeInTheDocument();
  });

  it("opens policy links from step 3", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<Onboarding />);

    await user.type(screen.getByPlaceholderText("Enter your answer"), "25");
    await user.click(screen.getByRole("button", { name: "Submit Answer" }));
    await user.click(await screen.findByRole("button", { name: "Continue" }));
    await user.click(await screen.findByRole("button", { name: "Terms of Service" }));

    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it("triggers onboarding flag + google sign in", async () => {
    const user = userEvent.setup();
    render(<Onboarding />);

    await user.type(screen.getByPlaceholderText("Enter your answer"), "25");
    await user.click(screen.getByRole("button", { name: "Submit Answer" }));
    expect(await screen.findByText("Amazing!")).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: "Continue" }));
    await user.click(await screen.findByRole("button", { name: "Continue with Google" }));

    expect(mocks.setOnboardingFlag).toHaveBeenCalledTimes(1);
    expect(mocks.signInWithGoogle).toHaveBeenCalledTimes(1);
  });
});
