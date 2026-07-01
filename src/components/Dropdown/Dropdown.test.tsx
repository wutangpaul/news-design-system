import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSeparator } from "./Dropdown";

function renderDropdown() {
  return render(
    <Dropdown>
      <DropdownTrigger>Open menu</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={vi.fn()}>First</DropdownItem>
        <DropdownItem onSelect={vi.fn()}>Second</DropdownItem>
        <DropdownItem disabled onSelect={vi.fn()}>
          Disabled
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={vi.fn()}>Third</DropdownItem>
      </DropdownMenu>
    </Dropdown>,
  );
}

describe("Dropdown", () => {
  it("trigger has aria-haspopup=menu and aria-expanded reflecting state", async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("menu is hidden until opened and uses role=menu/menuitem", async () => {
    const user = userEvent.setup();
    renderDropdown();
    expect(screen.getByRole("menu", { hidden: true })).not.toBeVisible();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("menu")).toBeVisible();
    expect(screen.getAllByRole("menuitem")).toHaveLength(4);
  });

  it("moves focus to the first menu item when opened by click", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus());
  });

  it("ArrowDown on the trigger opens the menu focused on the first item", async () => {
    const user = userEvent.setup();
    renderDropdown();
    screen.getByRole("button", { name: "Open menu" }).focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus());
  });

  it("ArrowUp on the trigger opens the menu focused on the last item", async () => {
    const user = userEvent.setup();
    renderDropdown();
    screen.getByRole("button", { name: "Open menu" }).focus();
    await user.keyboard("{ArrowUp}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Third" })).toHaveFocus());
  });

  it("ArrowDown/ArrowUp navigate between items, skipping disabled ones", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus());

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Second" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Third" })).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Second" })).toHaveFocus();
  });

  it("Home/End jump to the first/last item", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus());

    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "Third" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
  });

  it("Escape closes the menu and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus());

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("clicking an item calls onSelect and closes the menu", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>Open menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onSelect={onSelect}>First</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("menuitem", { name: "First" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  it("clicking outside the dropdown closes the menu", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Dropdown>
          <DropdownTrigger>Open menu</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onSelect={vi.fn()}>First</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <button type="button">Outside</button>
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("menu")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Outside" }));
    await waitFor(() => expect(screen.getByRole("menu", { hidden: true })).not.toBeVisible());
  });

  it("does not activate a disabled item", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>Open menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem disabled onSelect={onSelect}>
            Disabled
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    const item = screen.getByRole("menuitem", { name: "Disabled" });
    expect(item).toBeDisabled();
    await user.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
