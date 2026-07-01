import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Radio, RadioGroup } from "./Radio";

function BasicGroup(props: { onChange?: (value: string) => void }) {
  return (
    <RadioGroup label="Delivery frequency" onChange={props.onChange}>
      <Radio value="daily" label="Daily" />
      <Radio value="weekly" label="Weekly" />
      <Radio value="monthly" label="Monthly" />
    </RadioGroup>
  );
}

describe("RadioGroup + Radio", () => {
  it("renders role=radiogroup with an accessible group label", () => {
    render(<BasicGroup />);
    const group = screen.getByRole("radiogroup", {
      name: "Delivery frequency",
    });
    expect(group).toBeInTheDocument();
  });

  it("associates each radio's label via htmlFor/id", () => {
    render(<BasicGroup />);
    expect(screen.getByLabelText("Daily")).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText("Weekly")).toBeInstanceOf(HTMLInputElement);
  });

  it("shares one name across all radios in the group", () => {
    render(<BasicGroup />);
    const daily = screen.getByLabelText("Daily") as HTMLInputElement;
    const weekly = screen.getByLabelText("Weekly") as HTMLInputElement;
    expect(daily.name).toBe(weekly.name);
    expect(daily.name).toBeTruthy();
  });

  it("selects an option on click and reports it via onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<BasicGroup onChange={handleChange} />);
    await user.click(screen.getByLabelText("Weekly"));
    expect(handleChange).toHaveBeenCalledWith("weekly");
  });

  it("supports arrow-key navigation between options via native radio grouping", async () => {
    const user = userEvent.setup();
    render(<BasicGroup />);
    const daily = screen.getByLabelText("Daily") as HTMLInputElement;
    const weekly = screen.getByLabelText("Weekly") as HTMLInputElement;
    daily.focus();
    await user.keyboard("{ArrowDown}");
    expect(weekly).toHaveFocus();
    expect(weekly.checked).toBe(true);
  });

  it("works as a controlled component", async () => {
    function Controlled() {
      const [value, setValue] = useState("daily");
      return (
        <RadioGroup label="Frequency" value={value} onChange={setValue}>
          <Radio value="daily" label="Daily" />
          <Radio value="weekly" label="Weekly" />
        </RadioGroup>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);
    expect((screen.getByLabelText("Daily") as HTMLInputElement).checked).toBe(
      true,
    );
    await user.click(screen.getByLabelText("Weekly"));
    expect(
      (screen.getByLabelText("Weekly") as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("associates helper text via aria-describedby on the group", () => {
    render(
      <RadioGroup label="Frequency" helperText="Applies to all alerts.">
        <Radio value="daily" label="Daily" />
      </RadioGroup>,
    );
    const group = screen.getByRole("radiogroup");
    const describedBy = group.getAttribute("aria-describedby");
    expect(screen.getByText("Applies to all alerts.").id).toBe(describedBy);
  });

  it("sets aria-invalid and shows the error message on the group", () => {
    render(
      <RadioGroup label="Frequency" errorText="Choose a frequency.">
        <Radio value="daily" label="Daily" />
      </RadioGroup>,
    );
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose a frequency.",
    );
  });

  it("disables every radio when the group is disabled", () => {
    render(
      <RadioGroup label="Frequency" disabled>
        <Radio value="daily" label="Daily" />
        <Radio value="weekly" label="Weekly" />
      </RadioGroup>,
    );
    expect(screen.getByLabelText("Daily")).toBeDisabled();
    expect(screen.getByLabelText("Weekly")).toBeDisabled();
  });

  it("throws when Radio is rendered outside a RadioGroup", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Radio value="x" label="Orphan" />)).toThrow(
      /must be rendered inside a RadioGroup/,
    );
    consoleError.mockRestore();
  });
});
