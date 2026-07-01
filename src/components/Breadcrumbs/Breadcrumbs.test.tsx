import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";

const items = [
  { label: "Home", href: "/" },
  { label: "World", href: "/world" },
  { label: "Article headline" },
];

describe("Breadcrumbs", () => {
  it("renders a nav labelled Breadcrumb", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders an ordered list of links for non-current items", () => {
    render(<Breadcrumbs items={items} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "World" })).toHaveAttribute("href", "/world");
  });

  it("marks the last item as the current page and renders it as plain text", () => {
    render(<Breadcrumbs items={items} />);
    const current = screen.getByText("Article headline");
    expect(current.tagName).not.toBe("A");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Article headline" })).not.toBeInTheDocument();
  });

  it("respects an explicit current flag instead of defaulting to the last item", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Current", href: "/current", current: true },
          { label: "Trailing", href: "/trailing" },
        ]}
      />,
    );
    expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Trailing" })).toBeInTheDocument();
  });

  it("marks separators as decorative with aria-hidden", () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const hiddenSeparators = container.querySelectorAll('li > span[aria-hidden="true"]');
    // One separator between each pair of adjacent items.
    expect(hiddenSeparators).toHaveLength(items.length - 1);
  });
});
