import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

function ControlledModal({
  size,
}: {
  size?: "sm" | "md" | "lg" | "fullscreen";
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete article" size={size}>
        <p>Are you sure?</p>
        <button>Cancel</button>
        <button>Confirm</button>
      </Modal>
    </div>
  );
}

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={() => {}} title="Hidden">
        content
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog semantics and labels it via aria-labelledby", () => {
    render(
      <Modal open onClose={() => {}} title="Delete article">
        body
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy as string)).toHaveTextContent("Delete article");
  });

  it("moves focus into the dialog on open and returns it to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<ControlledModal />);

    await user.click(screen.getByText("Open modal"));
    await waitFor(() => expect(screen.getByLabelText("Close dialog")).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByText("Open modal")).toHaveFocus();
  });

  it("traps Tab focus within the dialog", async () => {
    const user = userEvent.setup();
    render(<ControlledModal />);
    await user.click(screen.getByText("Open modal"));

    const cancel = await screen.findByText("Cancel");
    const confirm = screen.getByText("Confirm");
    const closeButton = screen.getByLabelText("Close dialog");

    expect(closeButton).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.tab();
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(confirm).toHaveFocus();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} title="Delete article">
        body
      </Modal>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the backdrop is clicked but not when the panel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} title="Delete article">
        <p>body</p>
      </Modal>,
    );

    await user.click(screen.getByText("body"));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("locks and restores body scroll", async () => {
    const user = userEvent.setup();
    render(<ControlledModal />);
    expect(document.body.style.overflow).not.toBe("hidden");

    await user.click(screen.getByText("Open modal"));
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.overflow).not.toBe("hidden"));
  });

  it("applies the requested size variant", () => {
    render(
      <Modal open onClose={() => {}} title="Big modal" size="lg">
        body
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("max-w-3xl");
  });
});
