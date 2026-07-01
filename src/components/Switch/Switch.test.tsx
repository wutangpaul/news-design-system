import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders with role=switch, not role=checkbox", () => {
    render(<Switch label="Dark mode" />);
    const control = screen.getByRole("switch", { name: "Dark mode" });
    expect(control).toBeInstanceOf(HTMLInputElement);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("associates the label with the switch via htmlFor/id", () => {
    render(<Switch label="Dark mode" />);
    expect(screen.getByLabelText("Dark mode")).toBe(
      screen.getByRole("switch"),
    );
  });

  it("exposes aria-checked reflecting the checked state", async () => {
    const user = userEvent.setup();
    render(<Switch label="Dark mode" />);
    const control = screen.getByRole("switch");
    expect(control).not.toBeChecked();
    await user.click(control);
    expect(control).toBeChecked();
  });

  it("is keyboard operable (Space toggles it)", async () => {
    const user = userEvent.setup();
    render(<Switch label="Dark mode" />);
    const control = screen.getByRole("switch") as HTMLInputElement;
    control.focus();
    await user.keyboard(" ");
    expect(control.checked).toBe(true);
  });

  it("visually reorders the label via flex-row-reverse when labelPosition is left", () => {
    // The control and label are siblings in DOM order regardless of position (so the
    // native htmlFor/id association and tab order stay predictable); visual placement
    // is controlled purely via the row's flex direction.
    const { container, rerender } = render(
      <Switch label="Dark mode" labelPosition="right" />,
    );
    const row = container.firstElementChild!.firstElementChild as HTMLElement;
    expect(row.className).not.toContain("flex-row-reverse");

    rerender(<Switch label="Dark mode" labelPosition="left" />);
    const reorderedRow = container.firstElementChild!
      .firstElementChild as HTMLElement;
    expect(reorderedRow.className).toContain("flex-row-reverse");
  });

  it("associates helper text via aria-describedby", () => {
    render(<Switch label="Dark mode" helperText="Applies to this device only." />);
    const control = screen.getByRole("switch");
    const describedBy = control.getAttribute("aria-describedby");
    expect(screen.getByText("Applies to this device only.").id).toBe(
      describedBy,
    );
  });

  it("sets aria-invalid and switches describedby to the error message", () => {
    render(
      <Switch
        label="Two-factor authentication"
        helperText="Recommended."
        errorText="This setting could not be saved."
      />,
    );
    const control = screen.getByRole("switch");
    expect(control).toHaveAttribute("aria-invalid", "true");
    const errorMessage = screen.getByRole("alert");
    expect(control.getAttribute("aria-describedby")).toBe(errorMessage.id);
  });

  it("supports disabled state", () => {
    render(<Switch label="Dark mode" disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("forwards a ref to the native input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch label="Dark mode" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("calls onChange when toggled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch label="Dark mode" onChange={handleChange} />);
    await user.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalled();
  });
});
