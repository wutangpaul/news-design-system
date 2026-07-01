import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MostRead } from "./MostRead";
import type { MostReadItem } from "./MostRead";

const items: MostReadItem[] = [
  {
    headline: "First story",
    href: "https://example.com/first",
    byline: "By Jane Doe",
    timestamp: "3 hours ago",
    timestampDateTime: "2026-06-30T09:00:00Z",
    imageSrc: "https://example.com/image.jpg",
    imageAlt: "Alt text",
  },
  { headline: "Second story", href: "https://example.com/second" },
  { headline: "Third story", href: "https://example.com/third" },
];

describe("MostRead", () => {
  it('defaults to a "Most Read" title', () => {
    render(<MostRead items={items} />);
    expect(screen.getByRole("heading", { name: "Most Read" })).toBeInTheDocument();
  });

  it("accepts a custom title", () => {
    render(<MostRead items={items} title="Most Popular This Week" />);
    expect(
      screen.getByRole("heading", { name: "Most Popular This Week" }),
    ).toBeInTheDocument();
  });

  it("renders items as an ordered list", () => {
    render(<MostRead items={items} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(items.length);
  });

  it("renders each headline as a link", () => {
    render(<MostRead items={items} />);
    for (const item of items) {
      expect(screen.getByRole("link", { name: item.headline })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });

  it("hides rank numerals from assistive tech (relies on native list semantics)", () => {
    render(<MostRead items={items} />);
    const rankNumerals = screen.getAllByText("1", { exact: true });
    expect(rankNumerals.some((el) => el.getAttribute("aria-hidden") === "true")).toBe(
      true,
    );
  });

  it("does not render thumbnails by default", () => {
    render(<MostRead items={items} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders thumbnails when showImages is set", () => {
    render(<MostRead items={items} showImages />);
    expect(screen.getByAltText("Alt text")).toBeInTheDocument();
  });

  it("renders byline and timestamp with a machine-readable datetime", () => {
    render(<MostRead items={items} />);
    expect(screen.getByText("By Jane Doe")).toBeInTheDocument();
    const time = screen.getByText("3 hours ago");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", "2026-06-30T09:00:00Z");
  });

  it("renders an optional subtitle", () => {
    render(<MostRead items={items} subtitle="Past 24 hours" />);
    expect(screen.getByText("Past 24 hours")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <MostRead items={items} subtitle="Past 24 hours" showImages />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
