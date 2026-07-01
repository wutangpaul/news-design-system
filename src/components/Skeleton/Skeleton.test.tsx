import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is aria-hidden", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("defaults to the text shape", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").className).toContain("rounded-sm");
  });

  it("renders the circle shape", () => {
    render(<Skeleton shape="circle" data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").className).toContain(
      "rounded-full",
    );
  });

  it("renders the rect shape", () => {
    render(<Skeleton shape="rect" data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").className).toContain("rounded-md");
  });

  it("animates by default but disables the infinite animation under reduced motion, falling back to a static low-opacity block", () => {
    render(<Skeleton data-testid="skeleton" />);
    const { className } = screen.getByTestId("skeleton");
    expect(className).toContain("animate-pulse");
    expect(className).toContain("motion-reduce:animate-none");
    expect(className).toContain("motion-reduce:opacity-70");
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <Skeleton
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("merges a custom className for sizing", () => {
    render(<Skeleton className="h-6 w-32" data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").className).toContain("w-32");
  });
});
