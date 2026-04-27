import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameCard } from "./GameCard";

const baseTournament = {
  id: "1",
  icon: "planet",
  name: "Starter",
  digitCount: 2,
  numberCount: 3,
  delay: 2000,
  numberOfQuestions: 12,
  operations: ["add", "divide"],
};

describe("GameCard", () => {
  it("renders regular mode with question count", () => {
    render(
      <GameCard
        tournament={baseTournament}
        mode="regular"
        onSelect={() => undefined}
      />
    );

    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("12 questions")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Divide")).toBeInTheDocument();
  });

  it("renders flash mode with interval", () => {
    render(
      <GameCard tournament={baseTournament} mode="flash" onSelect={() => undefined} />
    );

    expect(screen.getByText("2s interval")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<GameCard tournament={baseTournament} mode="flash" onSelect={onSelect} />);

    await user.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
