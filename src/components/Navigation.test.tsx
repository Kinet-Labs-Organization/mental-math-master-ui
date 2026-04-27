import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navigation } from "./Navigation";

describe("Navigation", () => {
  it("calls onSectionChange when a section is selected", async () => {
    const user = userEvent.setup();
    const onSectionChange = vi.fn();

    render(
      <Navigation activeSection="progress" onSectionChange={onSectionChange} />
    );

    await user.click(screen.getByRole("button", { name: "Leaderboard" }));
    expect(onSectionChange).toHaveBeenCalledWith("leaderboard");
  });

  it("marks the active section in the desktop navigation", () => {
    render(<Navigation activeSection="settings" onSectionChange={() => undefined} />);

    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toHaveClass("relative");
  });
});
