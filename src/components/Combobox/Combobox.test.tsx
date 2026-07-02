import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Combobox, type ComboboxOption } from "./Combobox";

const SECTIONS: ComboboxOption[] = [
  { label: "Politics", value: "politics" },
  { label: "Business", value: "business" },
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
];

function ControlledCombobox(props: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Combobox
      label="Section"
      options={SECTIONS}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange?.(next);
      }}
    />
  );
}

describe("Combobox", () => {
  it("associates the label with the field and sets combobox role/ARIA wiring", () => {
    render(<Combobox label="Section" options={SECTIONS} />);
    const field = screen.getByRole("combobox", { name: "Section" });
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).toHaveAttribute("aria-autocomplete", "list");
    expect(field).toHaveAttribute("aria-controls");
    const listbox = document.getElementById(field.getAttribute("aria-controls") as string);
    expect(listbox).toHaveAttribute("role", "listbox");
  });

  it("shows the full option list on focus", async () => {
    const user = userEvent.setup();
    render(<Combobox label="Section" options={SECTIONS} />);
    await user.click(screen.getByRole("combobox", { name: "Section" }));
    expect(screen.getAllByRole("option")).toHaveLength(SECTIONS.length);
  });

  it("filters options client-side as the user types", async () => {
    const user = userEvent.setup();
    render(<Combobox label="Section" options={SECTIONS} />);
    await user.type(screen.getByRole("combobox", { name: "Section" }), "tech");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Technology");
  });

  it("calls onInputChange with the raw typed text on every keystroke", async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    render(<Combobox label="Section" options={SECTIONS} onInputChange={onInputChange} />);
    await user.type(screen.getByRole("combobox", { name: "Section" }), "biz");
    expect(onInputChange).toHaveBeenCalledWith("b");
    expect(onInputChange).toHaveBeenLastCalledWith("biz");
  });

  it("shows a no-matches option when nothing filters in", async () => {
    const user = userEvent.setup();
    render(<Combobox label="Section" options={SECTIONS} noOptionsMessage="Nothing found" />);
    await user.type(screen.getByRole("combobox", { name: "Section" }), "zzz");
    expect(screen.getByRole("option", { name: "Nothing found" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("moves aria-activedescendant with ArrowDown/ArrowUp and selects with Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledCombobox onChange={onChange} />);
    const field = screen.getByRole("combobox", { name: "Section" });

    await user.click(field);
    await user.keyboard("{ArrowDown}");
    const firstOption = screen.getByRole("option", { name: "Politics" });
    expect(field).toHaveAttribute("aria-activedescendant", firstOption.id);

    await user.keyboard("{ArrowDown}");
    const secondOption = screen.getByRole("option", { name: "Business" });
    expect(field).toHaveAttribute("aria-activedescendant", secondOption.id);

    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("business");
    await waitFor(() => expect(field).toHaveValue("Business"));
    expect(field).toHaveAttribute("aria-expanded", "false");
  });

  it("selects an option via mouse click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox label="Section" options={SECTIONS} onChange={onChange} />);
    await user.click(screen.getByRole("combobox", { name: "Section" }));
    await user.click(screen.getByRole("option", { name: "Sports" }));

    expect(onChange).toHaveBeenCalledWith("sports");
    expect(screen.getByRole("combobox", { name: "Section" })).toHaveValue("Sports");
  });

  it("Escape closes the list and reverts typed text to the selected option", async () => {
    const user = userEvent.setup();
    render(<ControlledCombobox />);
    const field = screen.getByRole("combobox", { name: "Section" });

    await user.click(field);
    await user.click(screen.getByRole("option", { name: "Technology" }));
    expect(field).toHaveValue("Technology");

    await user.click(field);
    await user.keyboard("xyz");
    expect(field).toHaveValue("Technologyxyz");

    await user.keyboard("{Escape}");
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).toHaveValue("Technology");
  });

  it("reverts unsubmitted typed text on blur", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ControlledCombobox />
        <button type="button">Elsewhere</button>
      </div>,
    );
    const field = screen.getByRole("combobox", { name: "Section" });
    await user.click(field);
    await user.keyboard("qqq");
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    expect(field).toHaveValue("");
  });

  it("shows helper text and switches to error text with aria-invalid", () => {
    const { rerender } = render(
      <Combobox label="Section" options={SECTIONS} helperText="Pick one section." />,
    );
    expect(screen.getByText("Pick one section.")).toBeInTheDocument();

    rerender(
      <Combobox
        label="Section"
        options={SECTIONS}
        helperText="Pick one section."
        errorText="Section is required."
      />,
    );
    const field = screen.getByRole("combobox", { name: "Section" });
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Section is required.");
    expect(screen.queryByText("Pick one section.")).not.toBeInTheDocument();
  });

  it("mirrors the selected value into a hidden input when name is provided", () => {
    render(<Combobox label="Section" options={SECTIONS} name="section" value="business" />);
    expect(document.querySelector('input[type="hidden"][name="section"]')).toHaveValue(
      "business",
    );
  });

  it("has no axe violations when closed or open", async () => {
    const { container } = render(<Combobox label="Section" options={SECTIONS} />);
    expect((await axe(container)).violations).toEqual([]);

    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox", { name: "Section" }));
    expect((await axe(container)).violations).toEqual([]);
  });
});
