import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select } from "./Select";

function Options() {
  return (
    <>
      <option value="news">News</option>
      <option value="sport">Sport</option>
      <option value="culture">Culture</option>
    </>
  );
}

describe("Select", () => {
  it("associates the label with the select via htmlFor/id", () => {
    render(
      <Select label="Section">
        <Options />
      </Select>,
    );
    expect(screen.getByLabelText("Section")).toBeInstanceOf(
      HTMLSelectElement,
    );
  });

  it("associates helper text via aria-describedby", () => {
    render(
      <Select label="Section" helperText="Choose where this runs.">
        <Options />
      </Select>,
    );
    const select = screen.getByLabelText("Section");
    const describedBy = select.getAttribute("aria-describedby");
    expect(screen.getByText("Choose where this runs.").id).toBe(describedBy);
  });

  it("sets aria-invalid and switches describedby to the error message", () => {
    render(
      <Select
        label="Section"
        helperText="Choose where this runs."
        errorText="Section is required."
      >
        <Options />
      </Select>,
    );
    const select = screen.getByLabelText("Section");
    expect(select).toHaveAttribute("aria-invalid", "true");
    const errorMessage = screen.getByRole("alert");
    expect(select.getAttribute("aria-describedby")).toBe(errorMessage.id);
  });

  it("renders native options and supports selection via keyboard/change", async () => {
    const user = userEvent.setup();
    render(
      <Select label="Section">
        <Options />
      </Select>,
    );
    const select = screen.getByLabelText("Section") as HTMLSelectElement;
    await user.selectOptions(select, "sport");
    expect(select.value).toBe("sport");
  });

  it("supports disabled state", () => {
    render(
      <Select label="Section" disabled>
        <Options />
      </Select>,
    );
    expect(screen.getByLabelText("Section")).toBeDisabled();
  });

  it("forwards a ref to the native select element", () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select label="Section" ref={ref}>
        <Options />
      </Select>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
