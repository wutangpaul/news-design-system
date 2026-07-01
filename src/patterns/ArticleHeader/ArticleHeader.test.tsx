import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { ArticleHeader } from "./ArticleHeader";

describe("ArticleHeader", () => {
  it("renders the title as a real h1", () => {
    render(<ArticleHeader title="Markets rally after rate pause" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Markets rally after rate pause");
  });

  it("renders inside a header element", () => {
    render(<ArticleHeader title="Headline" data-testid="article-header" />);
    expect(screen.getByTestId("article-header").tagName).toBe("HEADER");
  });

  it("does not render a standfirst when omitted", () => {
    render(<ArticleHeader title="Headline" />);
    expect(screen.queryByText(/standfirst/i)).not.toBeInTheDocument();
  });

  it("renders the standfirst when provided", () => {
    render(<ArticleHeader title="Headline" standfirst="A quick summary of the story." />);
    expect(screen.getByText("A quick summary of the story.")).toBeInTheDocument();
  });

  it("renders arbitrary byline content via the byline slot without imposing its own markup", () => {
    render(
      <ArticleHeader
        title="Headline"
        byline={<span data-testid="custom-byline">By Jordan Reyes</span>}
      />,
    );
    expect(screen.getByTestId("custom-byline")).toHaveTextContent("By Jordan Reyes");
  });

  it("does not render a byline wrapper when byline is omitted", () => {
    render(<ArticleHeader title="Headline" data-testid="article-header" />);
    const header = screen.getByTestId("article-header");
    // Only the h1 should be present as a child element.
    expect(header.children).toHaveLength(1);
  });

  it("forwards a ref to the header element", () => {
    const ref = createRef<HTMLElement>();
    render(<ArticleHeader ref={ref} title="Headline" />);
    expect(ref.current?.tagName).toBe("HEADER");
  });

  it("forwards remaining props to the header element", () => {
    render(<ArticleHeader title="Headline" aria-label="Article header" data-testid="article-header" />);
    expect(screen.getByTestId("article-header")).toHaveAttribute("aria-label", "Article header");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ArticleHeader
        title="City council approves record transit budget"
        standfirst="A summary of the story."
        byline={<span>By Jordan Reyes</span>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
