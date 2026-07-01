import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Badge variant="success">Published</Badge>);
    expect(screen.getByText("Published").className).toContain("bg-success-50");
  });

  it("applies size classes", () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText("Small").className).toContain("text-caption");
  });

  it("renders dot-only mode without visible text", () => {
    const { container } = render(<Badge dot variant="error" />);
    const dot = container.firstChild as HTMLElement;
    expect(dot.className).toContain("rounded-full");
    expect(dot.className).toContain("bg-error-500");
  });

  it("keeps dot label available to screen readers via visually-hidden text", () => {
    render(<Badge dot variant="success">Online</Badge>);
    const hiddenText = screen.getByText("Online");
    expect(hiddenText.className).toContain("sr-only");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Badge variant="info">Updated</Badge>);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
