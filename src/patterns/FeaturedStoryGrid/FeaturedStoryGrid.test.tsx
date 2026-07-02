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
    // The grid-span utility must land on the <a> wrapper itself: that anchor is the
    // grid's direct child, so a span class on any nested element (like the Card inside
    // it) has no layout effect.
    const featuredGridItem = featuredHeading.closest("a");
    expect(featuredGridItem?.className).toContain("sm:col-span-2");
  });

  it("does not span non-featured items", () => {
    render(<FeaturedStoryGrid stories={items} />);
    const secondHeading = screen.getByRole("heading", {
      name: items[1]!.headline,
    });
    const secondGridItem = secondHeading.closest("a");
    expect(secondGridItem?.className).not.toContain("col-span-2");
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

  describe("loading state", () => {
    it("renders loadingCount loading cards instead of stories", () => {
      const { container } = render(<FeaturedStoryGrid loading loadingCount={6} />);
      const skeletonCards = container.querySelectorAll("[aria-hidden='true'].overflow-hidden");
      expect(skeletonCards.length).toBe(6);
    });

    it("defaults loadingCount to 6", () => {
      const { container } = render(<FeaturedStoryGrid loading />);
      const skeletonCards = container.querySelectorAll("[aria-hidden='true'].overflow-hidden");
      expect(skeletonCards.length).toBe(6);
    });

    it("does not render any real story content while loading, even if stories is also passed", () => {
      render(<FeaturedStoryGrid loading stories={items} />);
      for (const item of items) {
        expect(screen.queryByRole("heading", { name: item.headline })).not.toBeInTheDocument();
      }
    });

    it("does not require stories while loading", () => {
      render(<FeaturedStoryGrid loading data-testid="grid" />);
      expect(screen.getByTestId("grid")).toBeInTheDocument();
    });

    it("announces the loading state via a single live region on the grid itself", () => {
      render(<FeaturedStoryGrid loading data-testid="grid" />);
      const grid = screen.getByTestId("grid");
      expect(grid).toHaveAttribute("role", "status");
      expect(grid).toHaveAttribute("aria-live", "polite");
    });

    it("has no axe violations while loading", async () => {
      const { container } = render(<FeaturedStoryGrid loading loadingCount={3} />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });
});
