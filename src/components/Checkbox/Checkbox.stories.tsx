import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Email me breaking news alerts",
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "We send at most one alert per hour.",
  },
};

export const WithError: Story = {
  args: {
    errorText: "You must accept the terms to continue.",
    label: "I accept the terms of service",
  },
};

export const Indeterminate: Story = {
  render: () => {
    const items = ["Sports", "Politics", "Culture"];
    const [checkedItems, setCheckedItems] = useState<boolean[]>([
      true,
      false,
      false,
    ]);
    const allChecked = checkedItems.every(Boolean);
    const someChecked = checkedItems.some(Boolean) && !allChecked;

    return (
      <div className="flex flex-col gap-3">
        <Checkbox
          label="All sections"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={(event) =>
            setCheckedItems(items.map(() => event.target.checked))
          }
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item, index) => (
            <Checkbox
              key={item}
              label={item}
              checked={checkedItems[index]}
              onChange={(event) =>
                setCheckedItems((prev) => {
                  const next = [...prev];
                  next[index] = event.target.checked;
                  return next;
                })
              }
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Checkbox {...args} size="sm" label="Small" />
      <Checkbox {...args} size="md" label="Medium" />
      <Checkbox {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};
