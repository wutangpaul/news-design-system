import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    iconVariant: {
      control: "select",
      options: [undefined, "search", "calendar", "message", "inbox"],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    iconVariant: "inbox",
    heading: "Nothing to show yet",
    description: "Once there's something here, it will show up in this space.",
  },
  render: (args) => (
    <div className="max-w-xl">
      <EmptyState {...args} />
    </div>
  ),
};

export const NoSearchResults: Story = {
  name: "No search results",
  args: {
    iconVariant: "search",
    heading: "No results found",
    description:
      'We couldn\'t find any stories matching "zoning reform". Try different or fewer keywords.',
  },
  render: (args) => (
    <div className="max-w-xl">
      <EmptyState {...args} role="status" />
    </div>
  ),
};

export const NoStoriesInRange: Story = {
  name: "No stories in date range",
  args: {
    iconVariant: "calendar",
    heading: "No stories found for this range",
    description: "Try a different date range — nothing published matches August 2026.",
  },
  render: (args) => (
    <div className="max-w-xl">
      <EmptyState {...args} />
    </div>
  ),
};

export const NoComments: Story = {
  name: "No comments yet",
  args: {
    iconVariant: "message",
    heading: "No comments yet",
    description: "Be the first to share your thoughts on this story.",
  },
  render: (args) => (
    <div className="max-w-xl">
      <EmptyState {...args} />
    </div>
  ),
};

export const WithAction: Story = {
  name: "With a call to action",
  args: {
    iconVariant: "search",
    heading: "No results found",
    description: "Try browsing by section instead, or head back to the homepage.",
    action: <Button variant="secondary">Browse all sections</Button>,
  },
  render: (args) => (
    <div className="max-w-xl">
      <EmptyState {...args} />
    </div>
  ),
};

export const CustomIcon: Story = {
  name: "Custom icon (via `icon`, not `iconVariant`)",
  args: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
        <path
          d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
    ),
    heading: "No bookmarks yet",
    description: "Save stories to read later and they'll show up here.",
  },
  render: (args) => (
    <div className="max-w-xl">
      <EmptyState {...args} />
    </div>
  ),
};

export const TextOnly: Story = {
  name: "Text-only (no icon)",
  args: {
    heading: "No results found",
    description: "Try a different search term.",
  },
  render: (args) => (
    <div className="max-w-xl">
      <EmptyState {...args} />
    </div>
  ),
};

export const HeadingLevel: Story = {
  name: "Custom heading level",
  args: {
    iconVariant: "inbox",
    heading: "No notifications",
    headingLevel: 3,
  },
  render: (args) => (
    <div className="max-w-xl">
      <EmptyState {...args} />
    </div>
  ),
};
