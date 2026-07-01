import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer, type DrawerSide } from "./Drawer";

function ControlledDrawer({ side }: { side?: DrawerSide }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open filters</button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters" side={side}>
        <button>Apply</button>
      </Drawer>
    </div>
  );
}

describe("Drawer", () => {
  it("renders nothing when closed", () => {
    render(
      <Drawer open={false} onClose={() => {}} title="Hidden">
        content
      </Drawer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog semantics labelled via aria-labelledby", () => {
    render(
      <Drawer open onClose={() => {}} title="Filters">
        body
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(document.getElementById(labelledBy as string)).toHaveTextContent("Filters");
  });

  it("moves focus in on open and returns focus to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<ControlledDrawer />);

    await user.click(screen.getByText("Open filters"));
    await waitFor(() => expect(screen.getByLabelText("Close drawer")).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByText("Open filters")).toHaveFocus();
  });

  it("traps Tab focus within the panel", async () => {
    const user = userEvent.setup();
    render(<ControlledDrawer />);
    await user.click(screen.getByText("Open filters"));

    const closeButton = await screen.findByLabelText("Close drawer");
    const apply = screen.getByText("Apply");

    expect(closeButton).toHaveFocus();
    await user.tab();
    expect(apply).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it("closes on Escape and on backdrop click but not on panel click", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer open onClose={onClose} title="Filters">
        <p>body</p>
      </Drawer>,
    );

    await user.click(screen.getByText("body"));
    expect(onClose).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("locks body scroll while open", async () => {
    const user = userEvent.setup();
    render(<ControlledDrawer />);
    expect(document.body.style.overflow).not.toBe("hidden");

    await user.click(screen.getByText("Open filters"));
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.overflow).not.toBe("hidden"));
  });

  it.each<[DrawerSide, string]>([
    ["left", "left-0"],
    ["right", "right-0"],
    ["top", "top-0"],
    ["bottom", "bottom-0"],
  ])("anchors to the %s edge", (side, expectedClass) => {
    render(
      <Drawer open onClose={() => {}} title="Filters" side={side}>
        body
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toHaveClass(expectedClass);
  });
});
