import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("is not rendered by default", () => {
    render(
      <Tooltip content="Saved 2 minutes ago">
        <button>Status</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows on hover after the delay and hides on mouse leave", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Saved 2 minutes ago" delayMs={10}>
        <button>Status</button>
      </Tooltip>,
    );

    await user.hover(screen.getByText("Status"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent("Saved 2 minutes ago"),
    );

    await user.unhover(screen.getByText("Status"));
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("shows immediately on keyboard focus and hides on blur", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content="Saved 2 minutes ago">
          <button>Status</button>
        </Tooltip>
        <button>Next</button>
      </div>,
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("sets aria-describedby on the trigger only while open", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Saved 2 minutes ago">
        <button>Status</button>
      </Tooltip>,
    );
    const trigger = screen.getByText("Status");

    expect(trigger).not.toHaveAttribute("aria-describedby");

    await user.tab();
    const tooltip = screen.getByRole("tooltip");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("dismisses on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Saved 2 minutes ago">
        <button>Status</button>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });
});
