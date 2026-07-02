import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Publish date",
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: "Articles publish at 6:00am in the selected timezone.",
  },
};

export const WithError: Story = {
  args: {
    errorText: "Select a publish date before submitting.",
  },
};

export const Preselected: Story = {
  render: (args) => {
    const [value, setValue] = useState("2026-07-15");
    return <DatePicker {...args} value={value} onChange={setValue} />;
  },
};

export const WithMinMax: Story = {
  name: "Bounded range (min/max)",
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <DatePicker
        {...args}
        label="Archive date"
        helperText="Only dates in the last 30 days are available."
        value={value}
        onChange={setValue}
        min="2026-06-02"
        max="2026-07-02"
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "2026-07-02",
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
        <DatePicker {...args} value={value} onChange={setValue} />
        <p className="text-small text-text-tertiary">
          Selected: {value ?? "none"}
        </p>
      </div>
    );
  },
};
