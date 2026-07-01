import { createRef, useRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("associates the label with the checkbox via htmlFor/id", () => {
    render(<Checkbox label="Subscribe to newsletter" />);
    const checkbox = screen.getByLabelText("Subscribe to newsletter");
    expect(checkbox).toBeInstanceOf(HTMLInputElement);
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("remains in the accessibility tree and is keyboard operable (not display:none)", () => {
    render(<Checkbox label="Subscribe to newsletter" />);
    const checkbox = screen.getByRole("checkbox", {
      name: "Subscribe to newsletter",
    });
    expect(checkbox).toBeVisible();
  });

  it("toggles on click and keyboard activation", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe to newsletter" />);
    const checkbox = screen.getByLabelText(
      "Subscribe to newsletter",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
    checkbox.focus();
    await user.keyboard(" ");
    expect(checkbox.checked).toBe(false);
  });

  it("associates helper text via aria-describedby", () => {
    render(
      <Checkbox label="Subscribe" helperText="We send one email a week." />,
    );
    const checkbox = screen.getByLabelText("Subscribe");
    const describedBy = checkbox.getAttribute("aria-describedby");
    expect(screen.getByText("We send one email a week.").id).toBe(
      describedBy,
    );
  });

  it("sets aria-invalid and switches describedby to the error message", () => {
    render(
      <Checkbox
        label="Accept terms"
        helperText="Required to continue."
        errorText="You must accept the terms."
      />,
    );
    const checkbox = screen.getByLabelText("Accept terms");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    const errorMessage = screen.getByRole("alert");
    expect(checkbox.getAttribute("aria-describedby")).toBe(errorMessage.id);
  });

  it("sets the DOM indeterminate property via ref since there is no HTML attribute for it", () => {
    function Wrapper() {
      const ref = useRef<HTMLInputElement>(null);
      return <Checkbox ref={ref} label="Select all" indeterminate />;
    }
    render(<Wrapper />);
    const checkbox = screen.getByLabelText("Select all") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it("updates indeterminate when the prop changes", () => {
    const { rerender } = render(
      <Checkbox label="Select all" indeterminate />,
    );
    const checkbox = screen.getByLabelText("Select all") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    rerender(<Checkbox label="Select all" indeterminate={false} />);
    expect(checkbox.indeterminate).toBe(false);
  });

  it("supports disabled state", () => {
    render(<Checkbox label="Subscribe" disabled />);
    expect(screen.getByLabelText("Subscribe")).toBeDisabled();
  });

  it("forwards a ref to the native input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Subscribe" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("calls onChange when toggled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox label="Subscribe" onChange={handleChange} />);
    await user.click(screen.getByLabelText("Subscribe"));
    expect(handleChange).toHaveBeenCalled();
  });
});
