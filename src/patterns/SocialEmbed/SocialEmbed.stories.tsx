import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocialEmbed } from "./SocialEmbed";

const meta = {
  title: "Patterns/Editorial/Social Embed",
  component: SocialEmbed,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SocialEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    platform: "x",
    authorName: "Priya Nair",
    authorHandle: "priyanair",
    text: "BREAKING: The redistricting commission has released its final proposed map — five incumbents now share overlapping districts. Full analysis on the site shortly.",
    href: "https://x.com/priyanair/status/1234567890",
    timestamp: "3h ago",
  },
};

export const Instagram: Story = {
  args: {
    platform: "instagram",
    authorName: "The Daily Ledger",
    authorHandle: "dailyledger",
    text: "Behind the scenes with our photo desk at last night's runoff watch party. Full gallery link in bio.",
    href: "https://instagram.com/p/example123",
    timestamp: "Jun 12",
  },
};

export const OtherPlatform: Story = {
  name: "Other platform (no named brand)",
  args: {
    platform: "other",
    platformLabel: "Bluesky",
    authorName: "Marcus Webb",
    authorHandle: "marcuswebb.bsky.social",
    text: "Turnout in the special election is already outpacing the last midterm cycle by double digits.",
    href: "https://bsky.app/profile/marcuswebb/post/example",
  },
};

export const WithoutTimestamp: Story = {
  name: "Without a timestamp",
  args: {
    platform: "facebook",
    authorName: "City Elections Office",
    authorHandle: "cityelections",
    text: "Polling locations remain open until 8pm local time. Find your nearest location using the link below.",
    href: "https://facebook.com/cityelections/posts/example",
  },
};
