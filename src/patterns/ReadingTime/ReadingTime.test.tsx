import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ReadingTime, WORDS_PER_MINUTE, minutesFromWordCount } from "./ReadingTime";

describe("ReadingTime", () => {
  it("renders a pre-computed minutes estimate as-is", () => {
    render(<ReadingTime minutes={6} />);
    expect(screen.getByText("6 min read")).toBeInTheDocument();
  });

  it("derives minutes from wordCount at WORDS_PER_MINUTE", () => {
    render(<ReadingTime wordCount={WORDS_PER_MINUTE * 3} />);
    expect(screen.getByText("3 min read")).toBeInTheDocument();
  });

  it("rounds a fractional minutes estimate up", () => {
    render(<ReadingTime wordCount={WORDS_PER_MINUTE * 3 + 1} />);
    expect(screen.getByText("4 min read")).toBeInTheDocument();
  });

  it("floors at 1 minute for very short word counts", () => {
    render(<ReadingTime wordCount={10} />);
    expect(screen.getByText("1 min read")).toBeInTheDocument();
  });

  it("exports the wpm constant and helper for consumers that need to precompute", () => {
    expect(WORDS_PER_MINUTE).toBe(200);
    expect(minutesFromWordCount(400)).toBe(2);
    expect(minutesFromWordCount(1)).toBe(1);
  });

  it("forwards a ref to the rendered element", () => {
    const ref = createRef<HTMLElement>();
    render(<ReadingTime minutes={5} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.textContent).toBe("5 min read");
  });

  it("applies the requested size and color classes", () => {
    render(<ReadingTime minutes={5} size="body" color="tertiary" data-testid="rt" />);
    const el = screen.getByTestId("rt");
    expect(el.className).toContain("text-body");
    expect(el.className).toContain("text-text-tertiary");
  });

  it("has no axe violations", async () => {
    const { container } = render(<ReadingTime minutes={6} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
