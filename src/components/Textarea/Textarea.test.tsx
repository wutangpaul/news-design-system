import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

function ControlledTextarea() {
  const [value, setValue] = useState("");
  return (
    <Textarea
      label="Summary"
      maxLength={20}
      showCount
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

describe("Textarea", () => {
  it("associates the label with the textarea via htmlFor/id", () => {
    render(<Textarea label="Summary" />);
    expect(screen.getByLabelText("Summary")).toBeInstanceOf(
      HTMLTextAreaElement,
    );
  });

  it("associates helper text via aria-describedby", () => {
    render(<Textarea label="Summary" helperText="Keep it under 200 words." />);
    const textarea = screen.getByLabelText("Summary");
    const describedBy = textarea.getAttribute("aria-describedby");
    expect(screen.getByText("Keep it under 200 words.").id).toBe(describedBy);
  });

  it("sets aria-invalid and switches describedby to the error message", () => {
    render(
      <Textarea
        label="Summary"
        helperText="Keep it under 200 words."
        errorText="Summary is required."
      />,
    );
    const textarea = screen.getByLabelText("Summary");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    const errorMessage = screen.getByRole("alert");
    expect(textarea.getAttribute("aria-describedby")).toContain(
      errorMessage.id,
    );
  });

  it("shows a character counter wired to aria-describedby", () => {
    render(
      <Textarea
        label="Summary"
        maxLength={20}
        showCount
        defaultValue="hello"
      />,
    );
    const textarea = screen.getByLabelText("Summary");
    const counter = screen.getByText("5/20");
    expect(textarea.getAttribute("aria-describedby")).toContain(counter.id);
  });

  it("updates the character counter as the user types (controlled)", async () => {
    const user = userEvent.setup();
    render(<ControlledTextarea />);
    await user.type(screen.getByLabelText("Summary"), "hi");
    expect(screen.getByText("2/20")).toBeInTheDocument();
  });

  it("is resizable by default (no resize-none class)", () => {
    render(<Textarea label="Summary" />);
    expect(screen.getByLabelText("Summary")).not.toHaveClass("resize-none");
  });

  it("supports disabled state", () => {
    render(<Textarea label="Summary" disabled />);
    expect(screen.getByLabelText("Summary")).toBeDisabled();
  });

  it("forwards a ref to the native textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Summary" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
