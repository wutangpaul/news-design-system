import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Article } from "./Article";

const header = { logo: <span>The Daily Ledger</span> };
const footer = {
  groups: [{ heading: "Sections", links: [{ label: "World", href: "/world" }] }],
};

describe("Article", () => {
  it("renders the site chrome: a banner header and a contentinfo footer", () => {
    render(
      <Article
        header={header}
        footer={footer}
        articleHeader={<h1>Headline</h1>}
        body={<p>Body copy</p>}
      />,
    );
    expect(screen.getByRole("banner")).toHaveTextContent("The Daily Ledger");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders a reading-progress bar", () => {
    render(
      <Article
        header={header}
        footer={footer}
        articleHeader={<h1>Headline</h1>}
        body={<p>Body copy</p>}
      />,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders the required articleHeader and body slots", () => {
    render(
      <Article
        header={header}
        footer={footer}
        articleHeader={<h1>The headline slot content</h1>}
        body={<p>The body slot content</p>}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "The headline slot content" })).toBeInTheDocument();
    expect(screen.getByText("The body slot content")).toBeInTheDocument();
  });

  it("renders the optional socialSharing, related, and comments slots only when provided", () => {
    const { rerender } = render(
      <Article
        header={header}
        footer={footer}
        articleHeader={<h1>Headline</h1>}
        body={<p>Body copy</p>}
      />,
    );
    expect(screen.queryByText("Share this")).not.toBeInTheDocument();
    expect(screen.queryByText("Related content")).not.toBeInTheDocument();
    expect(screen.queryByText("Comments content")).not.toBeInTheDocument();

    rerender(
      <Article
        header={header}
        footer={footer}
        articleHeader={<h1>Headline</h1>}
        body={<p>Body copy</p>}
        socialSharing={<div>Share this</div>}
        related={<div>Related content</div>}
        comments={<div>Comments content</div>}
      />,
    );
    expect(screen.getByText("Share this")).toBeInTheDocument();
    expect(screen.getByText("Related content")).toBeInTheDocument();
    expect(screen.getByText("Comments content")).toBeInTheDocument();
  });

  it("constrains the reading column to the ~65ch reading measure", () => {
    render(
      <Article
        header={header}
        footer={footer}
        articleHeader={<h1>Headline</h1>}
        body={<p data-testid="body-copy">Body copy</p>}
      />,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveClass("max-w-[65ch]");
    expect(main).toContainElement(screen.getByTestId("body-copy"));
  });

  it("orders the article slots within the reading column: header, then body, then social/related/comments", () => {
    render(
      <Article
        header={header}
        footer={footer}
        articleHeader={<h1>Headline slot</h1>}
        body={<p>Body slot</p>}
        socialSharing={<div>Social slot</div>}
        related={<div>Related slot</div>}
        comments={<div>Comments slot</div>}
      />,
    );
    const main = screen.getByRole("main");
    const text = main.textContent ?? "";
    const headerIndex = text.indexOf("Headline slot");
    const bodyIndex = text.indexOf("Body slot");
    const socialIndex = text.indexOf("Social slot");
    const relatedIndex = text.indexOf("Related slot");
    const commentsIndex = text.indexOf("Comments slot");
    expect(headerIndex).toBeGreaterThanOrEqual(0);
    expect(headerIndex).toBeLessThan(bodyIndex);
    expect(bodyIndex).toBeLessThan(socialIndex);
    expect(socialIndex).toBeLessThan(relatedIndex);
    expect(relatedIndex).toBeLessThan(commentsIndex);
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Article
        ref={ref}
        header={header}
        footer={footer}
        articleHeader={<h1>Headline</h1>}
        body={<p>Body copy</p>}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Article
        header={header}
        footer={footer}
        articleHeader={<h1>Headline</h1>}
        body={<p>Body copy</p>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
