import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Input } from "./Input";

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-full w-full">
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.58 3.58a.75.75 0 1 1-1.06 1.06l-3.58-3.58A7 7 0 0 1 2 9Z"
      clipRule="evenodd"
    />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Email address",
    placeholder: "you@example.com",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: "We'll only use this to send you a receipt.",
  },
};

export const WithError: Story = {
  args: {
    helperText: "We'll only use this to send you a receipt.",
    errorText: "Enter a valid email address.",
    defaultValue: "not-an-email",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} size="sm" label="Small" />
      <Input {...args} size="md" label="Medium" />
      <Input {...args} size="lg" label="Large" />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    label: "Search articles",
    leadingIcon: <SearchIcon />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Locked field",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "Cannot be edited",
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Input
        label="Headline"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        helperText={`${value.length}/60 characters`}
      />
    );
  },
};
