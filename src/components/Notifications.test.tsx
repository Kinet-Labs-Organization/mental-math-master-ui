import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Notifications } from "./Notifications";

const mocks = {
  fetchNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
  navigate: vi.fn(),
};

let notificationsState: any = {
  unread: 2,
  notifications: [
    {
      id: 1,
      title: "New Challenge Available",
      message: "Try the new weekly challenge now!",
      time: new Date().toISOString(),
      read: false,
    },
    {
      id: 2,
      title: "Weekly Review",
      message: "Your progress report is ready.",
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: true,
    },
  ],
};

let notificationsLoading = false;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock("../store/useUserStore", () => ({
  useUserStore: () => ({
    notifications: notificationsState,
    notificationsLoading,
    fetchNotifications: mocks.fetchNotifications,
    markNotificationRead: mocks.markNotificationRead,
  }),
}));

describe("Notifications", () => {
  beforeEach(() => {
    mocks.fetchNotifications.mockReset();
    mocks.markNotificationRead.mockReset();
    mocks.navigate.mockReset();
    notificationsState = {
      unread: 2,
      notifications: [
        {
          id: 1,
          title: "New Challenge Available",
          message: "Try the new weekly challenge now!",
          time: new Date().toISOString(),
          read: false,
        },
        {
          id: 2,
          title: "Weekly Review",
          message: "Your progress report is ready.",
          time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: true,
        },
      ],
    };
    notificationsLoading = false;
  });

  it("fetches notifications on mount", async () => {
    render(<Notifications />);

    await waitFor(() => {
      expect(mocks.fetchNotifications).toHaveBeenCalledTimes(1);
    });
  });

  it("renders notification items and unread badge", () => {
    render(<Notifications />);

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("New Challenge Available")).toBeInTheDocument();
    expect(screen.getByText("Weekly Review")).toBeInTheDocument();
  });

  it("opens notification detail and marks unread notification as read", async () => {
    render(<Notifications />);

    fireEvent.click(screen.getByText("New Challenge Available"));

    await waitFor(() => {
      expect(mocks.markNotificationRead).toHaveBeenCalledWith(1);
      expect(mocks.fetchNotifications).toHaveBeenCalledTimes(2);
      expect(screen.getByText("Try the new weekly challenge now!")).toBeInTheDocument();
    });
  });

  it("renders no notifications state when there are none", () => {
    notificationsState = { unread: 0, notifications: [] };
    render(<Notifications />);

    expect(screen.getByText("No notifications")).toBeInTheDocument();
    expect(screen.queryByText("New Challenge Available")).not.toBeInTheDocument();
  });

  it("renders loading skeleton when notifications are loading", () => {
    notificationsLoading = true;
    notificationsState = null;

    render(<Notifications />);

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.queryByText("New Challenge Available")).not.toBeInTheDocument();
    expect(screen.queryByText("No notifications")).not.toBeInTheDocument();
  });
});
