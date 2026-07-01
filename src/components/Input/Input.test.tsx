import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("associates the label with the input via htmlFor/id", () => {
    render(<Input label="Email address" />);
    const input = screen.getByLabelText("Email address");
    expect(input).toBeInstanceOf(HTMLInputElement);
  });

  it("generates a stable id when none is provided", () => {
    render(<Input label="Email address" />);
    const input = screen.getByLabelText("Email address");
    expect(input.id).toBeTruthy();
  });

  it("uses a caller-provided id instead of generating one", () => {
    render(<Input label="Email address" id="custom-id" />);
    expect(screen.getByLabelText("Email address")).toHaveAttribute(
      "id",
      "custom-id",
    );
  });

  it("associates helper text via aria-describedby", () => {
    render(<Input label="Email address" helperText="We'll never share it." />);
    const input = screen.getByLabelText("Email address");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("We'll never share it.").id).toBe(describedBy);
  });

  it("sets aria-invalid and switches describedby to the error message when errorText is present", () => {
    render(
      <Input
        label="Email address"
        helperText="We'll never share it."
        errorText="Enter a valid email."
      />,
    );
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("Enter a valid email.");
    expect(input.getAttribute("aria-describedby")).toBe(errorMessage.id);
    expect(screen.queryByText("We'll never share it.")).not.toBeInTheDocument();
  });

  it("does not set aria-invalid when there is no error", () => {
    render(<Input label="Email address" />);
    expect(screen.getByLabelText("Email address")).not.toHaveAttribute(
      "aria-invalid",
    );
  });

  it("renders leading and trailing icons", () => {
    render(
      <Input
        label="Search"
        leadingIcon={<span data-testid="leading-icon" />}
        trailingIcon={<span data-testid="trailing-icon" />}
      />,
    );
    expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
    expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<Input label="Email address" disabled />);
    expect(screen.getByLabelText("Email address")).toBeDisabled();
  });

  it("supports readOnly state", () => {
    render(<Input label="Email address" readOnly defaultValue="hi" />);
    expect(screen.getByLabelText("Email address")).toHaveAttribute(
      "readonly",
    );
  });

  it("forwards a ref to the native input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email address" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input label="Email address" onChange={handleChange} />);
    await user.type(screen.getByLabelText("Email address"), "hi@example.com");
    expect(handleChange).toHaveBeenCalled();
  });
});
