import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { RecommendedArticles, type RecommendedArticle } from "./RecommendedArticles";

const articles: RecommendedArticle[] = [
  {
    id: "1",
    headline: "First recommended headline",
    href: "https://example.com/first",
    thumbnailSrc: "https://example.com/first.jpg",
    thumbnailAlt: "First thumbnail",
    category: "Politics",
  },
  {
    id: "2",
    headline: "Second recommended headline",
    href: "https://example.com/second",
    thumbnailSrc: "https://example.com/second.jpg",
    thumbnailAlt: "Second thumbnail",
    category: "Business",
  },
];

describe("RecommendedArticles", () => {
  it("renders the default section title", () => {
    render(<RecommendedArticles articles={articles} />);
    expect(
      screen.getByRole("heading", { name: "Recommended for you" }),
    ).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<RecommendedArticles title="Because you read about tech" articles={articles} />);
    expect(
      screen.getByRole("heading", { name: "Because you read about tech" }),
    ).toBeInTheDocument();
  });

  it("renders one link per article with its headline and category", () => {
    render(<RecommendedArticles articles={articles} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    const firstLink = screen.getByRole("link", { name: /First recommended headline/ });
    expect(firstLink).toHaveAttribute("href", "https://example.com/first");
    expect(screen.getByText("Politics")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
  });

  it("associates the heading with the section via aria-labelledby", () => {
    render(<RecommendedArticles articles={articles} />);
    const heading = screen.getByRole("heading", { name: "Recommended for you" });
    const section = heading.closest("section");
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
  });

  it("renders an empty-state message when there are no articles", () => {
    render(<RecommendedArticles articles={[]} />);
    expect(screen.getByText(/no recommendations available/i)).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<RecommendedArticles articles={articles} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
