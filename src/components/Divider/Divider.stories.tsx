import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Divider {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-16 items-center gap-4 text-text-primary text-body">
      <span>Sports</span>
      <Divider {...args} />
      <span>Politics</span>
      <Divider {...args} />
      <span>Business</span>
    </div>
  ),
};

export const WithLabel: Story = {
  name: "With label (e.g. \"OR\")",
  args: { label: "OR" },
  render: (args) => (
    <div className="w-80">
      <Divider {...args} />
    </div>
  ),
};

export const SectionLabel: Story = {
  args: { label: "MORE FROM THIS SECTION" },
  render: (args) => (
    <div className="w-96">
      <Divider {...args} />
    </div>
  ),
};
