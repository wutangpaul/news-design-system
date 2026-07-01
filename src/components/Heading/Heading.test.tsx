import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { Heading } from "./Heading";

describe("Heading", () => {
  it.each([1, 2, 3, 4, 5, 6] as const)("renders an h%i tag for level=%i", (level) => {
    render(<Heading level={level}>Headline</Heading>);
    const heading = screen.getByRole("heading", { level });
    expect(heading.tagName).toBe(`H${level}`);
  });

  it("applies the size class matching the level by default", () => {
    render(<Heading level={3}>Headline</Heading>);
    expect(screen.getByRole("heading", { level: 3 }).className).toContain("text-h3");
  });

  it("decouples visual size from semantic level", () => {
    render(
      <Heading level={2} visualSize={5}>
        Headline
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.tagName).toBe("H2");
    expect(heading.className).toContain("text-h5");
    expect(heading.className).not.toContain("text-h2");
  });

  it("supports the display visual size", () => {
    render(
      <Heading level={1} visualSize="display">
        Headline
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 1 }).className).toContain("text-display");
  });

  it("uses the serif font family", () => {
    render(<Heading level={2}>Headline</Heading>);
    expect(screen.getByRole("heading", { level: 2 }).className).toContain("font-serif");
  });

  it("defaults to bold weight and supports overrides", () => {
    const { rerender } = render(<Heading level={2}>Headline</Heading>);
    expect(screen.getByRole("heading", { level: 2 }).className).toContain("font-bold");

    rerender(
      <Heading level={2} weight="regular">
        Headline
      </Heading>,
    );
    // "regular" omits a font-weight class entirely (see Heading.tsx comment) — 400 is
    // the implicit browser default, and emitting `font-regular` would otherwise erase
    // `font-serif` due to a cn()/tailwind-merge classification gap.
    const headingClassName = screen.getByRole("heading", { level: 2 }).className;
    expect(headingClassName).not.toContain("font-bold");
    expect(headingClassName).toContain("font-serif");
  });

  it("forwards a ref to the heading element", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Heading ref={ref} level={4}>
        Headline
      </Heading>,
    );
    expect(ref.current?.tagName).toBe("H4");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Heading level={2}>Accessible headline</Heading>);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
