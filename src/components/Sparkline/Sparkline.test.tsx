import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
  it("renders with its narrative label as the accessible name", () => {
    render(<Sparkline label="7-day pageviews, up 12%" values={[1, 2, 3]} />);
    expect(screen.getByRole("img", { name: "7-day pageviews, up 12%" })).toBeInTheDocument();
  });

  it("hides the SVG itself from assistive tech (the label carries the meaning)", () => {
    const { container } = render(<Sparkline label="Trend" values={[1, 2, 3]} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders at the default size", () => {
    const { container } = render(<Sparkline label="Trend" values={[1, 2, 3]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "80");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("accepts a custom size", () => {
    const { container } = render(<Sparkline label="Trend" values={[1, 2, 3]} width={64} height={20} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "64");
    expect(svg).toHaveAttribute("height", "20");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Sparkline label="7-day pageviews, up 12%" values={[1, 2, 3]} showTrend />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
