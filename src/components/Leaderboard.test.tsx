import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Leaderboard } from "./Leaderboard";

const mocks = {
  fetchLeaderboard: vi.fn(),
  fetchBasicReport: vi.fn(),
};

const leaderboardArray = [
  { name: "Alice", score: 2400, accuracy: 98, rank: 1 },
  { name: "Bob", score: 2200, accuracy: 95, rank: 2 },
  { name: "Carmen", score: 2000, accuracy: 92, rank: 3 },
  { name: "Daniel", score: 1850, accuracy: 89, rank: 4 },
  { name: "Elena", score: 1700, accuracy: 86, rank: 5 },
];

let genericStoreData: any = leaderboardArray;
let genericStoreLoading = false;
let reportStoreData: any = { score: 1810, accuracyRate: 91 };

vi.mock("../store/useGenericStore", () => ({
  useGenericStore: () => ({
    leaderboardData: genericStoreData,
    leaderboardLoading: genericStoreLoading,
    fetchLeaderboard: mocks.fetchLeaderboard,
  }),
}));

vi.mock("../store/useReportStore", () => ({
  useReportStore: () => ({
    basicReport: reportStoreData,
    fetchBasicReport: mocks.fetchBasicReport,
  }),
}));

describe("Leaderboard", () => {
  beforeEach(() => {
    mocks.fetchLeaderboard.mockReset();
    mocks.fetchBasicReport.mockReset();
    genericStoreData = leaderboardArray;
    genericStoreLoading = false;
    reportStoreData = { score: 1810, accuracyRate: 91 };
  });

  it("fetches leaderboard and basic report on mount", async () => {
    render(<Leaderboard />);

    await waitFor(() => {
      expect(mocks.fetchLeaderboard).toHaveBeenCalledTimes(1);
      expect(mocks.fetchBasicReport).toHaveBeenCalledTimes(1);
    });
  });

  it("renders top three players and the rest of the leaderboard", async () => {
    render(<Leaderboard />);

    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("2200")).toBeInTheDocument();
    expect(screen.getByText("Carmen")).toBeInTheDocument();
    expect(screen.getByText("89% accuracy")).toBeInTheDocument();

    expect(screen.getByText("Daniel")).toBeInTheDocument();
    expect(screen.getByText("Elena")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("1810")).toBeInTheDocument();
  });

  it("renders current user rank from leaderboard data object", async () => {
    genericStoreData = {
      leaderboard: leaderboardArray,
      currentUserRank: 2,
    };
    reportStoreData = { score: 1810, accuracyRate: 91 };
    genericStoreLoading = false;

    render(<Leaderboard />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders skeleton loader while leaderboard is loading", async () => {
    genericStoreData = null;
    genericStoreLoading = true;
    reportStoreData = { score: 1810, accuracyRate: 91 };

    render(<Leaderboard />);

    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("You")).not.toBeInTheDocument();
  });
});
