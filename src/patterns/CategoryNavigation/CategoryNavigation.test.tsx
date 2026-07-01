import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CategoryNavigation, type CategoryNavItem } from "./CategoryNavigation";

const items: CategoryNavItem[] = [
  { label: "World", href: "/world" },
  { label: "Politics", href: "/politics", current: true },
  { label: "Business", href: "/business" },
];

describe("CategoryNavigation", () => {
  it("renders a nav landmark with a default aria-label", () => {
    render(<CategoryNavigation items={items} />);
    expect(screen.getByRole("navigation", { name: "Section navigation" })).toBeInTheDocument();
  });

  it("supports a custom aria-label", () => {
    render(<CategoryNavigation items={items} ariaLabel="News sections" />);
    expect(screen.getByRole("navigation", { name: "News sections" })).toBeInTheDocument();
  });

  it("renders non-current items as real links", () => {
    render(<CategoryNavigation items={items} />);
    expect(screen.getByRole("link", { name: "World" })).toHaveAttribute("href", "/world");
    expect(screen.getByRole("link", { name: "Business" })).toHaveAttribute("href", "/business");
  });

  it("renders the current item as plain text marked aria-current, not a link", () => {
    render(<CategoryNavigation items={items} />);
    expect(screen.queryByRole("link", { name: "Politics" })).not.toBeInTheDocument();
    expect(screen.getByText("Politics")).toHaveAttribute("aria-current", "page");
  });

  it("renders items in the given order", () => {
    render(<CategoryNavigation items={items} />);
    const labels = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(labels).toEqual(["World", "Politics", "Business"]);
  });

  it("has no axe violations", async () => {
    const { container } = render(<CategoryNavigation items={items} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
