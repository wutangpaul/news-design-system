import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { GlobalHeader } from "./GlobalHeader";

describe("GlobalHeader", () => {
  it("renders a header landmark containing the logo slot", () => {
    render(<GlobalHeader logo={<span>The Daily Ledger</span>} />);
    const header = screen.getByRole("banner");
    expect(header).toHaveTextContent("The Daily Ledger");
  });

  it("renders the primaryNavigation, search, and actions slots when provided", () => {
    render(
      <GlobalHeader
        logo={<span>Logo</span>}
        primaryNavigation={<nav aria-label="Primary">nav content</nav>}
        search={<button type="button">Search</button>}
        actions={<button type="button">Subscribe</button>}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("renders none of the optional slots when omitted", () => {
    render(<GlobalHeader logo={<span>Logo</span>} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies sticky positioning classes only when sticky is set", () => {
    const { rerender } = render(<GlobalHeader logo={<span>Logo</span>} />);
    expect(screen.getByRole("banner")).not.toHaveClass("sticky");

    rerender(<GlobalHeader logo={<span>Logo</span>} sticky />);
    expect(screen.getByRole("banner")).toHaveClass("sticky");
  });

  it("forwards a ref to the header element", () => {
    const ref = createRef<HTMLElement>();
    render(<GlobalHeader ref={ref} logo={<span>Logo</span>} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("HEADER");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <GlobalHeader
        logo={<span>The Daily Ledger</span>}
        primaryNavigation={<nav aria-label="Primary">nav content</nav>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
