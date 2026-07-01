import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { Text } from "./Text";

describe("Text", () => {
  it("renders as a <p> by default", () => {
    render(<Text>Body copy</Text>);
    const node = screen.getByText("Body copy");
    expect(node.tagName).toBe("P");
  });

  it("renders the requested element via `as`", () => {
    render(
      <Text as="span" data-testid="text">
        Inline copy
      </Text>,
    );
    expect(screen.getByTestId("text").tagName).toBe("SPAN");
  });

  it("applies size variant classes", () => {
    render(<Text size="lead">Lead copy</Text>);
    expect(screen.getByText("Lead copy").className).toContain("text-lead");
  });

  it("applies color variant classes", () => {
    render(<Text color="secondary">Secondary copy</Text>);
    expect(screen.getByText("Secondary copy").className).toContain("text-text-secondary");
  });

  it("forwards a ref to the rendered DOM node", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Text ref={ref} as="div">
        Ref copy
      </Text>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges a custom className", () => {
    render(<Text className="italic">Styled copy</Text>);
    expect(screen.getByText("Styled copy").className).toContain("italic");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Text>Accessible body copy</Text>);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
