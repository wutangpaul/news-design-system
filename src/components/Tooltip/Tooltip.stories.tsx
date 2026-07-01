import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[280px] items-center justify-center p-16">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const triggerClassName =
  "rounded-md border border-surface-border bg-surface-raised px-3 py-1.5 text-small font-medium";

export const Default: Story = {
  render: () => (
    <Tooltip content="Published 2 hours ago">
      <button className={triggerClassName}>Hover or focus me</button>
    </Tooltip>
  ),
};

export const Top: Story = {
  render: () => (
    <Tooltip content="Published 2 hours ago" side="top">
      <button className={triggerClassName}>Top</button>
    </Tooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <Tooltip content="Published 2 hours ago" side="right">
      <button className={triggerClassName}>Right</button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip content="Published 2 hours ago" side="bottom">
      <button className={triggerClassName}>Bottom</button>
    </Tooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <Tooltip content="Published 2 hours ago" side="left">
      <button className={triggerClassName}>Left</button>
    </Tooltip>
  ),
};

export const CollisionFlip: Story = {
  name: "Collision flip (near viewport edge)",
  render: () => (
    <div className="flex justify-end">
      <Tooltip content="Flips to stay on screen" side="right">
        <button className={triggerClassName}>Edge of viewport</button>
      </Tooltip>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <Tooltip content="Published 2 hours ago">
      <button className={triggerClassName}>Hover or focus me</button>
    </Tooltip>
  ),
  globals: { theme: "dark" },
};
