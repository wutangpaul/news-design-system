import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Trending } from "./Trending";
import type { TrendingItem } from "./Trending";

const items: TrendingItem[] = [
  {
    headline: "Central bank signals possible rate cut",
    href: "https://example.com/story/rate-cut",
    timestamp: "Updated 12 minutes ago",
  },
  {
    headline: "Startup unveils home battery breakthrough",
    href: "https://example.com/story/battery-breakthrough",
    timestamp: "Updated 20 minutes ago",
  },
];

describe("Trending", () => {
  it('defaults to a "Trending Now" title', () => {
    render(<Trending items={items} />);
    expect(screen.getByRole("heading", { name: "Trending Now" })).toBeInTheDocument();
  });

  it("accepts a custom title", () => {
    render(<Trending items={items} title="What's Trending" />);
    expect(screen.getByRole("heading", { name: "What's Trending" })).toBeInTheDocument();
  });

  it("renders items as an ordered list", () => {
    render(<Trending items={items} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(items.length);
  });

  it("renders each headline as a link", () => {
    render(<Trending items={items} />);
    for (const item of items) {
      expect(screen.getByRole("link", { name: item.headline })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });

  it("renders an optional subtitle", () => {
    render(<Trending items={items} subtitle="Updated every few minutes" />);
    expect(screen.getByText("Updated every few minutes")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Trending items={items} subtitle="Updated every few minutes" />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
