import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "New",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "success", "warning", "error", "info", "brand"],
    },
    size: { control: "select", options: ["sm", "md"] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args} variant="neutral">
        Neutral
      </Badge>
      <Badge {...args} variant="success">
        Published
      </Badge>
      <Badge {...args} variant="warning">
        Pending review
      </Badge>
      <Badge {...args} variant="error">
        Retracted
      </Badge>
      <Badge {...args} variant="info">
        Updated
      </Badge>
      <Badge {...args} variant="brand">
        Editor&apos;s pick
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
    </div>
  ),
};

export const DotOnly: Story = {
  name: "Dot-only mode",
  render: () => (
    <div className="flex flex-wrap items-center gap-4 text-text-primary text-body">
      <span className="flex items-center gap-2">
        <Badge dot variant="error">
          Unread
        </Badge>
        Live coverage
      </span>
      <span className="flex items-center gap-2">
        <Badge dot variant="success">
          Online
        </Badge>
        Reporter available
      </span>
    </div>
  ),
};
