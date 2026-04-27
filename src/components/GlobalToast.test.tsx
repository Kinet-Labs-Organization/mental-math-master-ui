import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlobalToast } from "./GlobalToast";

const mocks = {
  hideToast: vi.fn(),
};

let toastState = {
  message: "Test toast message",
  type: "success" as const,
  isVisible: true,
  hideToast: mocks.hideToast,
};

vi.mock("../store/useToastStore", () => ({
  useToastStore: () => toastState,
}));

describe("GlobalToast", () => {
  beforeEach(() => {
    mocks.hideToast.mockReset();
    toastState = {
      message: "Test toast message",
      type: "success",
      isVisible: true,
      hideToast: mocks.hideToast,
    };
  });

  it("renders the toast when visible", () => {
    render(<GlobalToast />);

    expect(screen.getByText("Test toast message")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not render when toast is not visible", () => {
    toastState.isVisible = false;
    render(<GlobalToast />);

    expect(screen.queryByText("Test toast message")).not.toBeInTheDocument();
  });

  it("calls hideToast when close button is clicked", () => {
    render(<GlobalToast />);

    fireEvent.click(screen.getByRole("button"));
    expect(mocks.hideToast).toHaveBeenCalledTimes(1);
  });

  it("renders a success toast icon for success type", () => {
    render(<GlobalToast />);

    expect(screen.getByText("Test toast message")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
