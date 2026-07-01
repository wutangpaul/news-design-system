import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SearchExperience } from "./SearchExperience";

describe("SearchExperience", () => {
  it("renders a labelled trigger button and no dialog by default", () => {
    render(<SearchExperience />);
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the search field on trigger click and focuses the input", async () => {
    const user = userEvent.setup();
    render(<SearchExperience />);
    await user.click(screen.getByRole("button", { name: "Search" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    await waitFor(() => expect(screen.getByRole("searchbox")).toHaveFocus());
  });

  it("calls onSearch with the trimmed query on submit and closes", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchExperience onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    const input = await screen.findByRole("searchbox");
    await user.type(input, "  climate policy  ");
    await user.keyboard("{Enter}");

    expect(onSearch).toHaveBeenCalledWith("climate policy");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("does not call onSearch for an empty/whitespace-only query", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchExperience onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    const input = await screen.findByRole("searchbox");
    await user.type(input, "   ");
    await user.keyboard("{Enter}");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<SearchExperience />);

    const trigger = screen.getByRole("button", { name: "Search" });
    await user.click(trigger);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("supports a custom placeholder and trigger label", async () => {
    const user = userEvent.setup();
    render(<SearchExperience placeholder="Search the archive" triggerLabel="Find articles" />);
    await user.click(screen.getByRole("button", { name: "Find articles" }));
    expect(await screen.findByPlaceholderText("Search the archive")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<SearchExperience />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
