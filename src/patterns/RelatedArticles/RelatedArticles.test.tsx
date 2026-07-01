import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { RelatedArticles, type RelatedArticle } from "./RelatedArticles";

const articles: RelatedArticle[] = [
  {
    id: "1",
    href: "/articles/one",
    title: "First related headline",
    imageSrc: "/one.jpg",
    imageAlt: "Illustration for the first article",
    category: "Local",
  },
  {
    id: "2",
    href: "/articles/two",
    title: "Second related headline",
    imageSrc: "/two.jpg",
    imageAlt: "Illustration for the second article",
  },
];

describe("RelatedArticles", () => {
  it("renders a section labelled by its heading", () => {
    render(<RelatedArticles articles={articles} />);
    const section = screen.getByRole("region", { name: "You might also like" });
    expect(section).toBeInTheDocument();
  });

  it("supports a custom heading and heading level", () => {
    render(<RelatedArticles articles={articles} heading="More on this story" headingLevel={3} />);
    const headingEl = screen.getByRole("heading", { level: 3, name: "More on this story" });
    expect(headingEl).toBeInTheDocument();
  });

  it("renders one list item per article with a link, headline, and thumbnail", () => {
    render(<RelatedArticles articles={articles} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);

    const firstLink = screen.getByRole("link", { name: /First related headline/ });
    expect(firstLink).toHaveAttribute("href", "/articles/one");
    expect(within(firstLink).getByRole("img", { name: "Illustration for the first article" })).toBeInTheDocument();
    expect(within(firstLink).getByText("First related headline")).toBeInTheDocument();
  });

  it("renders a category tag only when provided", () => {
    render(<RelatedArticles articles={articles} />);
    expect(screen.getByText("Local")).toBeInTheDocument();

    const secondLink = screen.getByRole("link", { name: /Second related headline/ });
    expect(within(secondLink).queryByText("Local")).not.toBeInTheDocument();
  });

  it("forwards a ref to the section element", () => {
    const ref = createRef<HTMLElement>();
    render(<RelatedArticles articles={articles} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("SECTION");
  });

  it("has no axe violations", async () => {
    const { container } = render(<RelatedArticles articles={articles} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
