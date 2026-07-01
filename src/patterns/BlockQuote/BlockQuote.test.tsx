import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { BlockQuote } from "./BlockQuote";

describe("BlockQuote", () => {
  it("renders a real blockquote element", () => {
    render(<BlockQuote quote="A genuine quotation." data-testid="block-quote" />);
    expect(screen.getByTestId("block-quote").tagName).toBe("BLOCKQUOTE");
  });

  it("renders the quote text", () => {
    render(<BlockQuote quote="A genuine quotation." />);
    expect(screen.getByText(/A genuine quotation\./)).toBeInTheDocument();
  });

  it("renders attribution inside a cite element", () => {
    render(<BlockQuote quote="A genuine quotation." attribution="Jane Doe" />);
    const cite = screen.getByText("— Jane Doe");
    expect(cite.tagName).toBe("CITE");
  });

  it("does not render a footer/cite when attribution is omitted", () => {
    render(<BlockQuote quote="A genuine quotation." />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(document.querySelector("cite")).not.toBeInTheDocument();
  });

  it("is not aria-hidden — genuine quotes must stay in the accessibility tree", () => {
    render(<BlockQuote quote="A genuine quotation." data-testid="block-quote" />);
    expect(screen.getByTestId("block-quote")).not.toHaveAttribute("aria-hidden");
  });

  it("forwards the native cite URL attribute distinct from the attribution prop", () => {
    render(
      <BlockQuote
        quote="A genuine quotation."
        attribution="Jane Doe"
        cite="https://example.com/source"
        data-testid="block-quote"
      />,
    );
    expect(screen.getByTestId("block-quote")).toHaveAttribute(
      "cite",
      "https://example.com/source",
    );
  });

  it("forwards a ref to the blockquote element", () => {
    const ref = createRef<HTMLQuoteElement>();
    render(<BlockQuote ref={ref} quote="A genuine quotation." />);
    expect(ref.current?.tagName).toBe("BLOCKQUOTE");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <BlockQuote quote="A genuine quotation." attribution="Jane Doe" />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
