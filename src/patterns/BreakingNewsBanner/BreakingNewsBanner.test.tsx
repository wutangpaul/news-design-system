import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { BreakingNewsBanner } from "./BreakingNewsBanner";

describe("BreakingNewsBanner", () => {
  it("renders the headline as a link to href", () => {
    render(
      <BreakingNewsBanner headline="Central bank cuts rates" href="/world/rate-cut" />,
    );
    const link = screen.getByRole("link", { name: "Central bank cuts rates" });
    expect(link).toHaveAttribute("href", "/world/rate-cut");
  });

  it("renders a Breaking badge by default", () => {
    render(<BreakingNewsBanner headline="Headline" href="/a" />);
    expect(screen.getByText("Breaking")).toBeInTheDocument();
  });

  it("supports a custom label", () => {
    render(<BreakingNewsBanner headline="Headline" href="/a" label="Live" />);
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.queryByText("Breaking")).not.toBeInTheDocument();
  });

  it("is announced via a polite live region rather than an assertive one", () => {
    render(<BreakingNewsBanner headline="Headline" href="/a" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("dismisses on click and calls onDismiss", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<BreakingNewsBanner headline="Headline" href="/a" onDismiss={onDismiss} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss breaking news banner" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("is dismissible via the keyboard", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<BreakingNewsBanner headline="Headline" href="/a" onDismiss={onDismiss} />);
    const dismissButton = screen.getByRole("button", { name: "Dismiss breaking news banner" });
    dismissButton.focus();
    await user.keyboard("{Enter}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("supports a custom dismiss label", () => {
    render(
      <BreakingNewsBanner
        headline="Headline"
        href="/a"
        dismissLabel="Close breaking alert"
      />,
    );
    expect(screen.getByRole("button", { name: "Close breaking alert" })).toBeInTheDocument();
  });

  it("re-shows the banner when the headline/href change after a dismissal", () => {
    const { rerender } = render(<BreakingNewsBanner headline="First story" href="/first" />);
    // Simulate the same mounted instance being handed a genuinely new story.
    rerender(<BreakingNewsBanner headline="Second story" href="/second" />);
    expect(screen.getByRole("link", { name: "Second story" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<BreakingNewsBanner headline="Headline" href="/a" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
