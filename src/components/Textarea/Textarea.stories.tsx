import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Article summary",
    placeholder: "Write a one-paragraph summary…",
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: "Shown in section fronts and social previews.",
  },
};

export const WithError: Story = {
  args: {
    errorText: "Summary is required before publishing.",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea {...args} size="sm" label="Small" />
      <Textarea {...args} size="md" label="Medium" />
      <Textarea {...args} size="lg" label="Large" />
    </div>
  ),
};

export const WithCharacterCounter: Story = {
  render: () => {
    const [value, setValue] = useState("Breaking news from the newsroom.");
    return (
      <Textarea
        label="Tweet-length summary"
        maxLength={140}
        showCount
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "This field is locked for review.",
  },
};
