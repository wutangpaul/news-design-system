import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { Combobox, type ComboboxOption } from "./Combobox";

const SECTIONS: ComboboxOption[] = [
  { label: "Politics", value: "politics" },
  { label: "Business", value: "business" },
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
  { label: "Culture", value: "culture" },
  { label: "Opinion", value: "opinion" },
  { label: "World", value: "world" },
  { label: "Science", value: "science" },
];

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Section",
    options: SECTIONS,
    placeholder: "Search sections…",
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: "Start typing to filter, or use the arrow keys.",
  },
};

export const WithError: Story = {
  args: {
    errorText: "Choose a section before continuing.",
  },
};

export const Preselected: Story = {
  render: (args) => {
    const [value, setValue] = useState("technology");
    return <Combobox {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "business",
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="flex flex-col gap-3">
        <Combobox {...args} value={value} onChange={setValue} />
        <p className="text-small text-text-tertiary">
          Selected: {value ?? "none"}
        </p>
      </div>
    );
  },
};

/**
 * Demonstrates driving filtering entirely from the consumer side (e.g. a debounced server
 * search): `filterOptions={false}` disables the built-in substring filter, and `onInputChange`
 * is used to recompute the `options` array passed back in.
 */
export const AsyncStyleFiltering: Story = {
  name: "Server-driven filtering (onInputChange)",
  render: () => {
    const [query, setQuery] = useState("");
    const [value, setValue] = useState<string | undefined>(undefined);
    // Stands in for a network request — in a real app this would be a fetch keyed on `query`.
    const results = useMemo(
      () => SECTIONS.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
      [query],
    );
    return (
      <Combobox
        label="Section (server-filtered)"
        options={results}
        filterOptions={false}
        onInputChange={setQuery}
        value={value}
        onChange={setValue}
        helperText="Options are recomputed from onInputChange, not filtered internally."
      />
    );
  },
};
