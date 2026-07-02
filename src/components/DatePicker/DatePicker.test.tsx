import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DatePicker } from "./DatePicker";

function ControlledDatePicker(props: {
  min?: string;
  max?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState<string | undefined>(props.defaultValue);
  return (
    <DatePicker
      label="Publish date"
      value={value}
      onChange={setValue}
      min={props.min}
      max={props.max}
    />
  );
}

describe("DatePicker", () => {
  it("associates the label with the field via htmlFor/id", () => {
    render(<DatePicker label="Publish date" />);
    const field = screen.getByLabelText("Publish date");
    expect(field).toBeInstanceOf(HTMLInputElement);
    expect(field).toHaveAttribute("readonly");
  });

  it("is closed by default and opens the calendar dialog on click", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Publish date" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const field = screen.getByLabelText("Publish date");
    expect(field).toHaveAttribute("aria-expanded", "false");

    await user.click(field);
    expect(screen.getByRole("dialog", { name: "Choose date" })).toBeInTheDocument();
    expect(field).toHaveAttribute("aria-expanded", "true");
  });

  it("displays a formatted value when a date is selected", () => {
    render(<DatePicker label="Publish date" value="2026-07-02" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Publish date")).toHaveValue("July 2, 2026");
  });

  it("navigates days with arrow keys and selects the focused day with Enter", async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker defaultValue="2026-07-02" />);

    await user.click(screen.getByLabelText("Publish date"));
    const startDay = await screen.findByRole("button", { name: "July 2, 2026" });
    await waitFor(() => expect(startDay).toHaveFocus());

    await user.keyboard("{ArrowRight}");
    const nextDayButton = screen.getByRole("button", { name: "July 3, 2026" });
    await waitFor(() => expect(nextDayButton).toHaveFocus());

    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByLabelText("Publish date")).toHaveValue("July 3, 2026"),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("Publish date")).toHaveFocus());
  });

  it("crosses a month boundary and re-focuses the corresponding day", async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker defaultValue="2026-07-31" />);

    await user.click(screen.getByLabelText("Publish date"));
    await waitFor(() => expect(screen.getByRole("button", { name: "July 31, 2026" })).toHaveFocus());

    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(screen.getByText(/August 2026/)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "August 1, 2026" })).toHaveFocus();
  });

  it("Escape closes the dialog without selecting and returns focus to the field", async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker defaultValue="2026-07-02" />);
    const field = screen.getByLabelText("Publish date");

    await user.click(field);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(field).toHaveFocus());
    expect(field).toHaveValue("July 2, 2026");
  });

  it("marks out-of-range days aria-disabled and ignores clicks on them", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        label="Publish date"
        value="2026-07-15"
        onChange={onChange}
        min="2026-07-10"
        max="2026-07-20"
      />,
    );

    await user.click(screen.getByLabelText("Publish date"));
    const outOfRangeDay = screen.getByRole("button", { name: "July 5, 2026" });
    expect(outOfRangeDay).toHaveAttribute("aria-disabled", "true");

    await user.click(outOfRangeDay);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows helper text and switches to error text with aria-invalid", () => {
    const { rerender } = render(
      <DatePicker label="Publish date" helperText="Pick the go-live date." />,
    );
    expect(screen.getByText("Pick the go-live date.")).toBeInTheDocument();

    rerender(
      <DatePicker
        label="Publish date"
        helperText="Pick the go-live date."
        errorText="Date is required."
      />,
    );
    const field = screen.getByLabelText("Publish date");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Date is required.");
    expect(screen.queryByText("Pick the go-live date.")).not.toBeInTheDocument();
  });

  it("has no axe violations when closed or open", async () => {
    const { container } = render(<DatePicker label="Publish date" />);
    expect((await axe(container)).violations).toEqual([]);

    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Publish date"));
    await screen.findByRole("dialog");
    expect((await axe(container)).violations).toEqual([]);
  });
});
