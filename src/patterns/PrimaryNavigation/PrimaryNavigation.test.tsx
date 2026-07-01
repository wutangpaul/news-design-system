import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { PrimaryNavigation, type PrimaryNavItem } from "./PrimaryNavigation";

const items: PrimaryNavItem[] = [
  { label: "Home", href: "/", current: true },
  {
    label: "Politics",
    href: "/politics",
    megaMenuColumns: [
      {
        heading: "Coverage",
        links: [
          { label: "Elections", href: "/politics/elections" },
          { label: "Congress", href: "/politics/congress" },
        ],
      },
    ],
  },
  { label: "Business", href: "/business" },
];

describe("PrimaryNavigation", () => {
  it("renders a labelled nav landmark", () => {
    render(<PrimaryNavigation items={items} />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });

  it("supports a custom aria-label", () => {
    render(<PrimaryNavigation items={items} ariaLabel="Site sections" />);
    expect(screen.getByRole("navigation", { name: "Site sections" })).toBeInTheDocument();
  });

  it("marks the current section with aria-current=page", () => {
    render(<PrimaryNavigation items={items} />);
    const homeLinks = screen.getAllByRole("link", { name: "Home" });
    expect(homeLinks[0]).toHaveAttribute("aria-current", "page");
    const businessLinks = screen.getAllByRole("link", { name: "Business" });
    expect(businessLinks[0]).not.toHaveAttribute("aria-current");
  });

  it("renders a MegaMenu trigger for items with megaMenuColumns", async () => {
    const user = userEvent.setup();
    render(<PrimaryNavigation items={items} />);
    const trigger = screen.getAllByRole("button", { name: "Politics" })[0];
    await user.click(trigger);
    expect(screen.getAllByRole("menuitem", { name: "Elections" })[0]).toBeInTheDocument();
  });

  it("opens the mobile Drawer from the menu toggle button and lists all items", async () => {
    const user = userEvent.setup();
    render(<PrimaryNavigation items={items} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");

    const withinDialog = within(dialog);
    expect(withinDialog.getByRole("link", { name: "Business" })).toBeInTheDocument();
    expect(withinDialog.getByRole("button", { name: "Politics" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands a mega menu section inside the mobile drawer via its accordion trigger", async () => {
    const user = userEvent.setup();
    render(<PrimaryNavigation items={items} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    const withinDialog = within(dialog);

    const sectionTrigger = withinDialog.getByRole("button", { name: "Politics" });
    await user.click(sectionTrigger);
    expect(sectionTrigger).toHaveAttribute("aria-expanded", "true");
    expect(withinDialog.getByRole("link", { name: "Elections" })).toBeVisible();
  });

  it("closes the mobile drawer on Escape and returns focus to the toggle button", async () => {
    const user = userEvent.setup();
    render(<PrimaryNavigation items={items} />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(toggle).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<PrimaryNavigation items={items} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
