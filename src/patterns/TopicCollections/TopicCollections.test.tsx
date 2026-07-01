import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TopicCollections, type TopicCollectionArticle } from "./TopicCollections";

const articles: TopicCollectionArticle[] = [
  {
    id: "1",
    headline: "Five races that could flip control of the Senate",
    href: "https://example.com/senate-races",
    thumbnailSrc: "https://example.com/senate.jpg",
    thumbnailAlt: "A campaign volunteer canvassing a neighborhood",
    label: "Analysis",
  },
  {
    id: "2",
    headline: "What redrawn districts mean for turnout",
    href: "https://example.com/redistricting",
    thumbnailSrc: "https://example.com/districts.jpg",
    thumbnailAlt: "A map of newly redrawn voting districts",
  },
];

describe("TopicCollections", () => {
  it("renders the topic as the section heading", () => {
    render(<TopicCollections topic="2026 Midterms: Full Coverage" articles={articles} />);
    expect(
      screen.getByRole("heading", { name: "2026 Midterms: Full Coverage" }),
    ).toBeInTheDocument();
  });

  it("renders the optional description when provided", () => {
    render(
      <TopicCollections
        topic="Wildfire Season"
        description="Coverage of the year's fire risk."
        articles={articles}
      />,
    );
    expect(screen.getByText("Coverage of the year's fire risk.")).toBeInTheDocument();
  });

  it("omits description text when not provided", () => {
    render(<TopicCollections topic="Wildfire Season" articles={articles} />);
    expect(screen.queryByText(/coverage of the year/i)).not.toBeInTheDocument();
  });

  it("renders a tag only for articles that provide a label", () => {
    render(<TopicCollections topic="Wildfire Season" articles={articles} />);
    expect(screen.getByText("Analysis")).toBeInTheDocument();
  });

  it("renders one link per article", () => {
    render(<TopicCollections topic="Wildfire Season" articles={articles} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: /Five races that could flip control of the Senate/ }),
    ).toHaveAttribute("href", "https://example.com/senate-races");
  });

  it("renders an empty-state message when there are no articles", () => {
    render(<TopicCollections topic="Wildfire Season" articles={[]} />);
    expect(screen.getByText(/no stories have been added/i)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TopicCollections topic="Wildfire Season" articles={articles} />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
