import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Section",
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="">Choose a section…</option>
      <option value="news">News</option>
      <option value="sport">Sport</option>
      <option value="culture">Culture</option>
      <option value="opinion">Opinion</option>
    </Select>
  ),
};

export const WithHelperText: Story = {
  args: {
    helperText: "This determines the section front it appears on.",
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Choose a section…</option>
      <option value="news">News</option>
      <option value="sport">Sport</option>
      <option value="culture">Culture</option>
    </Select>
  ),
};

export const WithError: Story = {
  args: {
    errorText: "Select a section before publishing.",
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Choose a section…</option>
      <option value="news">News</option>
      <option value="sport">Sport</option>
      <option value="culture">Culture</option>
    </Select>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Select label="Small" size="sm">
        <option value="news">News</option>
        <option value="sport">Sport</option>
      </Select>
      <Select label="Medium" size="md">
        <option value="news">News</option>
        <option value="sport">Sport</option>
      </Select>
      <Select label="Large" size="lg">
        <option value="news">News</option>
        <option value="sport">Sport</option>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Select {...args}>
      <option value="news">News</option>
      <option value="sport">Sport</option>
    </Select>
  ),
};

export const WithOptionGroups: Story = {
  render: (args) => (
    <Select {...args} label="Byline">
      <optgroup label="Staff">
        <option value="jdoe">Jane Doe</option>
        <option value="asmith">Alex Smith</option>
      </optgroup>
      <optgroup label="Wire services">
        <option value="ap">Associated Press</option>
        <option value="reuters">Reuters</option>
      </optgroup>
    </Select>
  ),
};
