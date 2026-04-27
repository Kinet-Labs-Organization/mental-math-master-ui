import { describe, expect, it, vi, afterEach } from "vitest";
import { formatNotificationTimeAgo } from "./time";

describe("formatNotificationTimeAgo", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns Just Now for empty or invalid input", () => {
    expect(formatNotificationTimeAgo()).toBe("Just Now");
    expect(formatNotificationTimeAgo("invalid-date")).toBe("Just Now");
  });

  it("returns Just Now for notifications within 10 minutes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-23T10:00:00.000Z"));

    expect(formatNotificationTimeAgo("2026-04-23T09:54:00.000Z")).toBe("Just Now");
  });

  it("rounds minutes down to nearest 5", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-23T10:00:00.000Z"));

    expect(formatNotificationTimeAgo("2026-04-23T09:48:00.000Z")).toBe("10 mins ago");
    expect(formatNotificationTimeAgo("2026-04-23T09:32:00.000Z")).toBe("25 mins ago");
  });

  it("returns hours and days for larger gaps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-23T10:00:00.000Z"));

    expect(formatNotificationTimeAgo("2026-04-23T07:59:00.000Z")).toBe("2 hr ago");
    expect(formatNotificationTimeAgo("2026-04-21T09:59:00.000Z")).toBe("2 days ago");
    expect(formatNotificationTimeAgo("2026-04-22T09:59:00.000Z")).toBe("1 day ago");
  });
});
