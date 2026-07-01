import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("has role status with a default accessible label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading",
    );
  });

  it("allows overriding the accessible label", () => {
    render(<Spinner label="Submitting comment" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Submitting comment",
    );
  });

  it("renders a spin animation glyph that is hidden under reduced motion", () => {
    render(<Spinner />);
    const status = screen.getByRole("status");
    const svg = status.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("animate-spin");
    expect(svg.getAttribute("class")).toContain("motion-reduce:hidden");
  });

  it("renders a non-spinning pulsing dot that only shows under reduced motion", () => {
    render(<Spinner />);
    const status = screen.getByRole("status");
    const dot = status.querySelector("span[aria-hidden='true']")!;
    expect(dot.className).toContain("hidden");
    expect(dot.className).toContain("motion-reduce:block");
    expect(dot.className).not.toContain("animate-spin");
  });

  it("applies the requested size", () => {
    render(<Spinner size="lg" />);
    const svg = screen.getByRole("status").querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("h-8");
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLSpanElement | null = null;
    render(
      <Spinner
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });
});
