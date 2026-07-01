import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTab, TabsPanel } from "./Tabs";

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs defaultValue="one" {...props}>
      <TabsList aria-label="Example tabs">
        <TabsTab value="one">One</TabsTab>
        <TabsTab value="two">Two</TabsTab>
        <TabsTab value="three">Three</TabsTab>
      </TabsList>
      <TabsPanel value="one">Panel one</TabsPanel>
      <TabsPanel value="two">Panel two</TabsPanel>
      <TabsPanel value="three">Panel three</TabsPanel>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("renders a tablist with the correct roles", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("shows only the active panel and hides the rest", () => {
    renderTabs();
    expect(screen.getByText("Panel one")).toBeVisible();
    expect(screen.getByText("Panel two")).not.toBeVisible();
    expect(screen.getByText("Panel three")).not.toBeVisible();
  });

  it("marks the active tab with aria-selected and roving tabindex", () => {
    renderTabs();
    const tabOne = screen.getByRole("tab", { name: "One" });
    const tabTwo = screen.getByRole("tab", { name: "Two" });
    expect(tabOne).toHaveAttribute("aria-selected", "true");
    expect(tabOne).toHaveAttribute("tabIndex", "0");
    expect(tabTwo).toHaveAttribute("aria-selected", "false");
    expect(tabTwo).toHaveAttribute("tabIndex", "-1");
  });

  it("associates each panel with its tab via aria-labelledby/aria-controls", () => {
    renderTabs();
    const tabOne = screen.getByRole("tab", { name: "One" });
    const panelOne = screen.getByText("Panel one");
    expect(tabOne.getAttribute("aria-controls")).toBe(panelOne.id);
    expect(panelOne.getAttribute("aria-labelledby")).toBe(tabOne.id);
  });

  it("switches tabs on click", async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel two")).toBeVisible();
    expect(screen.getByText("Panel one")).not.toBeVisible();
  });

  it("moves focus and selection with ArrowRight/ArrowLeft, wrapping at the ends", async () => {
    const user = userEvent.setup();
    renderTabs();
    const tabOne = screen.getByRole("tab", { name: "One" });
    tabOne.focus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");
  });

  it("jumps to the first/last tab with Home/End", async () => {
    const user = userEvent.setup();
    renderTabs();
    screen.getByRole("tab", { name: "Two" }).focus();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("skips disabled tabs during arrow-key navigation", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Example tabs">
          <TabsTab value="one">One</TabsTab>
          <TabsTab value="two" disabled>
            Two
          </TabsTab>
          <TabsTab value="three">Three</TabsTab>
        </TabsList>
        <TabsPanel value="one">Panel one</TabsPanel>
        <TabsPanel value="two">Panel two</TabsPanel>
        <TabsPanel value="three">Panel three</TabsPanel>
      </Tabs>,
    );
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();
  });

  it("supports controlled usage via value/onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs value="one" onValueChange={onValueChange}>
        <TabsList aria-label="Example tabs">
          <TabsTab value="one">One</TabsTab>
          <TabsTab value="two">Two</TabsTab>
        </TabsList>
        <TabsPanel value="one">Panel one</TabsPanel>
        <TabsPanel value="two">Panel two</TabsPanel>
      </Tabs>,
    );
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
    // Controlled: panel does not change until the `value` prop is updated externally.
    expect(screen.getByText("Panel one")).toBeVisible();
  });
});
