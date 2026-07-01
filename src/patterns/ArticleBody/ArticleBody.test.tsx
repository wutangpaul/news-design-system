import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { ArticleBody } from "./ArticleBody";

describe("ArticleBody", () => {
  it("renders arbitrary children as-is", () => {
    render(
      <ArticleBody>
        <p>First paragraph.</p>
        <h2>A section heading</h2>
        <p>Second paragraph.</p>
      </ArticleBody>,
    );
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("A section heading");
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("constrains content to the ~65ch reading measure", () => {
    render(
      <ArticleBody data-testid="article-body">
        <p>Some copy.</p>
      </ArticleBody>,
    );
    expect(screen.getByTestId("article-body").className).toContain("max-w-[65ch]");
  });

  it("renders as a div by default", () => {
    render(<ArticleBody data-testid="article-body">content</ArticleBody>);
    expect(screen.getByTestId("article-body").tagName).toBe("DIV");
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ArticleBody ref={ref}>content</ArticleBody>);
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("forwards remaining props to the root element", () => {
    render(
      <ArticleBody aria-label="Article body" data-testid="article-body">
        content
      </ArticleBody>,
    );
    expect(screen.getByTestId("article-body")).toHaveAttribute("aria-label", "Article body");
  });

  it("merges a custom className with the default styling", () => {
    render(
      <ArticleBody className="custom-class" data-testid="article-body">
        content
      </ArticleBody>,
    );
    const className = screen.getByTestId("article-body").className;
    expect(className).toContain("custom-class");
    expect(className).toContain("max-w-[65ch]");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ArticleBody>
        <p>First paragraph.</p>
        <h2>A section heading</h2>
        <p>Second paragraph.</p>
      </ArticleBody>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
