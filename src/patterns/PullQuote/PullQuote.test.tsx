import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { PullQuote } from "./PullQuote";

describe("PullQuote", () => {
  it("renders the quote text", () => {
    render(<PullQuote quote="A striking excerpt." />);
    expect(screen.getByText("A striking excerpt.")).toBeInTheDocument();
  });

  it("renders attribution when provided", () => {
    render(<PullQuote quote="A striking excerpt." attribution="Jane Doe" />);
    expect(screen.getByText("— Jane Doe")).toBeInTheDocument();
  });

  it("does not render attribution when omitted", () => {
    const { container } = render(<PullQuote quote="A striking excerpt." />);
    expect(container.textContent).toBe("A striking excerpt.");
  });

  it("is hidden from the accessibility tree, since it repeats body content", () => {
    render(<PullQuote quote="A striking excerpt." data-testid="pull-quote" />);
    expect(screen.getByTestId("pull-quote")).toHaveAttribute("aria-hidden", "true");
  });

  it("does not render as a blockquote", () => {
    render(<PullQuote quote="A striking excerpt." data-testid="pull-quote" />);
    expect(screen.getByTestId("pull-quote").tagName).toBe("DIV");
  });

  it("applies centered alignment classes when align is center", () => {
    render(<PullQuote quote="A striking excerpt." align="center" data-testid="pull-quote" />);
    expect(screen.getByTestId("pull-quote").className).toContain("text-center");
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<PullQuote ref={ref} quote="A striking excerpt." />);
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("forwards remaining props to the root element", () => {
    render(<PullQuote quote="A striking excerpt." data-testid="pull-quote" />);
    expect(screen.getByTestId("pull-quote")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <PullQuote quote="A striking excerpt." attribution="Jane Doe" />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
