import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Enable dark mode",
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const On: Story = {
  args: {
    defaultChecked: true,
  },
};

export const LabelOnLeft: Story = {
  args: {
    labelPosition: "left",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "Applies to this device only.",
  },
};

export const WithError: Story = {
  args: {
    label: "Two-factor authentication",
    errorText: "This setting could not be saved. Try again.",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Switch {...args} size="sm" label="Small" />
      <Switch {...args} size="md" label="Medium" />
      <Switch {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        label="Breaking news alerts"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        helperText={checked ? "You'll be notified instantly." : "Notifications are off."}
      />
    );
  },
};
