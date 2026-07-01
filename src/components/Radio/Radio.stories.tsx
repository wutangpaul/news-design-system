import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Radio, RadioGroup } from "./Radio";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("weekly");
    return (
      <RadioGroup label="Delivery frequency" value={value} onChange={setValue}>
        <Radio value="daily" label="Daily" />
        <Radio value="weekly" label="Weekly" />
        <Radio value="monthly" label="Monthly" />
      </RadioGroup>
    );
  },
};

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState("weekly");
    return (
      <RadioGroup
        label="Delivery frequency"
        helperText="Applies to all newsletter subscriptions."
        value={value}
        onChange={setValue}
      >
        <Radio value="daily" label="Daily" />
        <Radio value="weekly" label="Weekly" />
        <Radio value="monthly" label="Monthly" />
      </RadioGroup>
    );
  },
};

export const WithError: Story = {
  render: () => (
    <RadioGroup label="Delivery frequency" errorText="Choose a frequency.">
      <Radio value="daily" label="Daily" />
      <Radio value="weekly" label="Weekly" />
      <Radio value="monthly" label="Monthly" />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup label="Layout" orientation="horizontal" defaultValue="grid">
      <Radio value="list" label="List" />
      <Radio value="grid" label="Grid" />
      <Radio value="magazine" label="Magazine" />
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup label="Small" size="sm" defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
      <RadioGroup label="Medium" size="md" defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
      <RadioGroup label="Large" size="lg" defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup label="Delivery frequency" disabled defaultValue="weekly">
      <Radio value="daily" label="Daily" />
      <Radio value="weekly" label="Weekly" />
      <Radio value="monthly" label="Monthly" />
    </RadioGroup>
  ),
};

export const IndividuallyDisabledOption: Story = {
  render: () => (
    <RadioGroup label="Delivery frequency" defaultValue="weekly">
      <Radio value="daily" label="Daily" />
      <Radio value="weekly" label="Weekly" />
      <Radio value="monthly" label="Monthly (unavailable)" disabled />
    </RadioGroup>
  ),
};
