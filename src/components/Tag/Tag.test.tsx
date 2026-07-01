import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders as static, non-interactive markup by default", () => {
    render(<Tag>Climate</Tag>);
    expect(screen.getByText("Climate")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the label as a button when interactive", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Tag interactive onClick={onClick}>
        Politics
      </Tag>,
    );
    const button = screen.getByRole("button", { name: "Politics" });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("reflects selected state via aria-pressed", () => {
    const { rerender } = render(
      <Tag interactive selected={false}>
        Politics
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Politics" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    rerender(
      <Tag interactive selected>
        Politics
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Politics" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("renders a remove button with a default accessible name", () => {
    render(<Tag removable>Climate</Tag>);
    expect(screen.getByRole("button", { name: "Remove Climate" })).toBeInTheDocument();
  });

  it("fires onRemove when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Tag removable onRemove={onRemove}>
        Climate
      </Tag>,
    );
    await user.click(screen.getByRole("button", { name: "Remove Climate" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("the remove button is keyboard operable", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Tag removable onRemove={onRemove}>
        Climate
      </Tag>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Remove Climate" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("renders interactive label and remove button as independent, non-nested controls", () => {
    render(
      <Tag interactive removable>
        Politics
      </Tag>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    // Neither button contains the other (no nested interactive elements).
    expect(buttons[0].contains(buttons[1])).toBe(false);
    expect(buttons[1].contains(buttons[0])).toBe(false);
  });

  it("supports a custom removeLabel", () => {
    render(
      <Tag removable removeLabel="Remove climate filter">
        Climate
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Remove climate filter" })).toBeInTheDocument();
  });

  it("has no axe violations when interactive and removable", async () => {
    const { container } = render(
      <Tag interactive removable>
        Climate
      </Tag>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
