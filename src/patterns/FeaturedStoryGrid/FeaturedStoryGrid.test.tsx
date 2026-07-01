import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FeaturedStoryGrid } from "./FeaturedStoryGrid";
import type { FeaturedStoryGridItem } from "./FeaturedStoryGrid";

const items: FeaturedStoryGridItem[] = [
  {
    headline: "Lead story headline",
    href: "https://example.com/lead",
    dek: "Lead story dek copy.",
    category: "Politics",
    byline: "By Jane Doe",
    timestamp: "3 hours ago",
    featured: true,
  },
  {
    headline: "Second story headline",
    href: "https://example.com/second",
    category: "Food",
  },
  {
    headline: "Third story headline",
    href: "https://example.com/third",
    category: "Weather",
  },
];

describe("FeaturedStoryGrid", () => {
  it("renders a card for every story", () => {
    render(<FeaturedStoryGrid stories={items} />);
    for (const item of items) {
      expect(
        screen.getByRole("heading", { name: item.headline }),
      ).toBeInTheDocument();
    }
  });

  it("renders every card with the same semantic heading level", () => {
    render(<FeaturedStoryGrid stories={items} headingLevel={4} />);
    for (const item of items) {
      expect(
        screen.getByRole("heading", { name: item.headline }).tagName,
      ).toBe("H4");
    }
  });

  it("defaults every card heading to h3", () => {
    render(<FeaturedStoryGrid stories={items} />);
    for (const item of items) {
      expect(
        screen.getByRole("heading", { name: item.headline }).tagName,
      ).toBe("H3");
    }
  });

  it("spans the featured item across 2 columns", () => {
    render(<FeaturedStoryGrid stories={items} />);
    const featuredHeading = screen.getByRole("heading", {
      name: items[0]!.headline,
    });
    // className with the grid-span utility lives on the Card root (the anchor's
    // first child), not on the wrapping <a> itself — see StoryCard's markup.
    const featuredCardRoot = featuredHeading.closest("a")?.firstElementChild;
    expect(featuredCardRoot?.className).toContain("sm:col-span-2");
  });

  it("does not span non-featured items", () => {
    render(<FeaturedStoryGrid stories={items} />);
    const secondHeading = screen.getByRole("heading", {
      name: items[1]!.headline,
    });
    const secondCardRoot = secondHeading.closest("a")?.firstElementChild;
    expect(secondCardRoot?.className).not.toContain("col-span-2");
  });

  it("renders links out to each story's href", () => {
    render(<FeaturedStoryGrid stories={items} />);
    for (const item of items) {
      expect(screen.getByRole("link", { name: new RegExp(item.headline) })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });

  it("applies the grid layout classes to the root element", () => {
    render(<FeaturedStoryGrid stories={items} data-testid="grid" />);
    expect(screen.getByTestId("grid").className).toContain("grid");
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <FeaturedStoryGrid
        stories={items}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(<FeaturedStoryGrid stories={items} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
