import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MegaMenu } from "./MegaMenu";

const columns = [
  {
    heading: "Coverage",
    links: [
      { label: "Elections", href: "/politics/elections" },
      { label: "Congress", href: "/politics/congress" },
      { label: "White House", href: "/politics/white-house" },
    ],
  },
  {
    heading: "States",
    links: [
      { label: "State Policy", href: "/politics/states/policy" },
      { label: "Governors", href: "/politics/states/governors" },
    ],
  },
];

describe("MegaMenu", () => {
  it("is closed by default and opens the panel on trigger click", async () => {
    const user = userEvent.setup();
    render(<MegaMenu label="Politics" columns={columns} />);

    expect(screen.getByRole("menu", { hidden: true })).not.toBeVisible();

    await user.click(screen.getByRole("button", { name: "Politics" }));
    expect(screen.getByRole("menu")).toBeVisible();
  });

  it("renders every column heading and link", async () => {
    const user = userEvent.setup();
    render(<MegaMenu label="Politics" columns={columns} />);
    await user.click(screen.getByRole("button", { name: "Politics" }));

    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByText("States")).toBeInTheDocument();
    for (const column of columns) {
      for (const link of column.links) {
        expect(screen.getByRole("menuitem", { name: link.label })).toHaveAttribute(
          "href",
          link.href,
        );
      }
    }
  });

  it("renders the featured link when provided", async () => {
    const user = userEvent.setup();
    render(
      <MegaMenu
        label="Politics"
        columns={columns}
        featured={{
          eyebrow: "Featured",
          label: "Inside the campaign",
          href: "/politics/features/inside",
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Politics" }));
    expect(screen.getByRole("menuitem", { name: "Inside the campaign" })).toHaveAttribute(
      "href",
      "/politics/features/inside",
    );
  });

  it("opens on trigger focus + ArrowDown and moves roving focus through links", async () => {
    const user = userEvent.setup();
    render(<MegaMenu label="Politics" columns={columns} />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Politics" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menu")).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Elections" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Congress" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<MegaMenu label="Politics" columns={columns} />);

    const trigger = screen.getByRole("button", { name: "Politics" });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeVisible();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.getByRole("menu", { hidden: true })).not.toBeVisible());
    expect(trigger).toHaveFocus();
  });

  it("does not toggle closed again on a second click before any other interaction", async () => {
    // Regression guard: MegaMenu must not layer any hover-driven state on top of Dropdown's
    // click toggle, since hovering-then-clicking would otherwise open and immediately
    // re-close the panel in the same interaction.
    const user = userEvent.setup();
    render(<MegaMenu label="Politics" columns={columns} />);

    const trigger = screen.getByRole("button", { name: "Politics" });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeVisible();

    await user.click(trigger);
    expect(screen.getByRole("menu", { hidden: true })).not.toBeVisible();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { container } = render(<MegaMenu label="Politics" columns={columns} />);
    await user.click(screen.getByRole("button", { name: "Politics" }));
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
