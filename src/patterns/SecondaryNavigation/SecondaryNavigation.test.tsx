import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SecondaryNavigation } from "./SecondaryNavigation";

const items = [
  { label: "Africa", href: "/world/africa" },
  { label: "Americas", href: "/world/americas", current: true },
  { label: "Asia", href: "/world/asia" },
];

describe("SecondaryNavigation", () => {
  it("renders a labelled nav landmark", () => {
    render(<SecondaryNavigation items={items} />);
    expect(screen.getByRole("navigation", { name: "Secondary" })).toBeInTheDocument();
  });

  it("supports a custom aria-label", () => {
    render(<SecondaryNavigation items={items} ariaLabel="World sub-sections" />);
    expect(screen.getByRole("navigation", { name: "World sub-sections" })).toBeInTheDocument();
  });

  it("renders every item as a real link with the correct href", () => {
    render(<SecondaryNavigation items={items} />);
    for (const item of items) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    }
  });

  it("marks the current item with aria-current=page and no others", () => {
    render(<SecondaryNavigation items={items} />);
    expect(screen.getByRole("link", { name: "Americas" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Africa" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Asia" })).not.toHaveAttribute("aria-current");
  });

  it("does not use tab/tabpanel roles — links are plain page navigation", () => {
    render(<SecondaryNavigation items={items} />);
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });

  it("is operable via standard link keyboard navigation (Tab)", async () => {
    const user = userEvent.setup();
    render(<SecondaryNavigation items={items} />);
    await user.tab();
    expect(screen.getByRole("link", { name: "Africa" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Americas" })).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<SecondaryNavigation items={items} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
