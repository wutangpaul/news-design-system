import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AdSlot } from "./AdSlot";

describe("AdSlot", () => {
  it("renders the default 'Advertisement' disclosure label", () => {
    render(<AdSlot />);
    expect(screen.getByText("Advertisement")).toBeInTheDocument();
  });

  it("supports a custom disclosure label (e.g. for native/sponsored content)", () => {
    render(<AdSlot label="Sponsored" />);
    expect(screen.getByText("Sponsored")).toBeInTheDocument();
    expect(screen.queryByText("Advertisement")).not.toBeInTheDocument();
  });

  it("exposes the disclosure label as an accessible landmark name", () => {
    render(<AdSlot label="Sponsored" />);
    expect(screen.getByRole("complementary", { name: "Sponsored" })).toBeInTheDocument();
  });

  it("shows a placeholder empty state with the slot's documented dimensions when no children are given", () => {
    render(<AdSlot size="medium-rectangle" />);
    expect(screen.getByText("Ad slot")).toBeInTheDocument();
    expect(screen.getByText("300", { exact: false })).toBeInTheDocument();
  });

  it.each([
    ["leaderboard", "728"],
    ["medium-rectangle", "300"],
    ["sidebar", "300"],
  ] as const)("renders the documented dimensions for the %s size", (size, expectedWidth) => {
    render(<AdSlot size={size} />);
    expect(screen.getByText(new RegExp(expectedWidth))).toBeInTheDocument();
  });

  it("renders injected children instead of the placeholder", () => {
    render(
      <AdSlot>
        <span>Real ad creative</span>
      </AdSlot>,
    );
    expect(screen.getByText("Real ad creative")).toBeInTheDocument();
    expect(screen.queryByText("Ad slot")).not.toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AdSlot ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto the root element", () => {
    render(<AdSlot data-testid="ad-slot-root" />);
    expect(screen.getByTestId("ad-slot-root")).toBeInTheDocument();
  });

  it("has no axe violations for the empty placeholder state", async () => {
    const { container } = render(<AdSlot />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("has no axe violations with injected content", async () => {
    const { container } = render(
      <AdSlot>
        <img src="https://example.com/ad.png" alt="Sponsor advertisement" />
      </AdSlot>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
