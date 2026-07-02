import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdSlot } from "./AdSlot";

const meta = {
  title: "Patterns/Editorial/Ad Slot",
  component: AdSlot,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof AdSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Leaderboard: Story = {
  args: {
    size: "leaderboard",
  },
};

export const MediumRectangle: Story = {
  name: "Medium rectangle (default)",
  args: {
    size: "medium-rectangle",
  },
};

export const Sidebar: Story = {
  args: {
    size: "sidebar",
  },
};

export const SponsoredLabel: Story = {
  name: "Custom disclosure label",
  args: {
    size: "medium-rectangle",
    label: "Sponsored",
  },
};

export const WithInjectedContent: Story = {
  name: "With injected ad content",
  render: () => (
    <AdSlot size="medium-rectangle">
      <img
        src="https://placehold.co/300x250?text=Ad+Creative"
        alt="Sample sponsor advertisement"
        className="h-full w-full object-cover"
      />
    </AdSlot>
  ),
};

export const AllSizes: Story = {
  name: "All standard sizes",
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <AdSlot size="leaderboard" />
      <AdSlot size="medium-rectangle" />
      <AdSlot size="sidebar" />
    </div>
  ),
};
