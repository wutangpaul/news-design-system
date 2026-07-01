import type { Meta, StoryObj } from "@storybook/react-vite";
import { Byline } from "./Byline";

const meta = {
  title: "Patterns/Editorial/Byline",
  component: Byline,
  parameters: {
    layout: "padded",
  },
  args: {
    authors: [{ name: "Jane Doe", href: "/authors/jane-doe", avatarSrc: "https://i.pravatar.cc/150?u=jane-doe" }],
    publishedAt: "2026-06-28T14:30:00.000Z",
  },
} satisfies Meta<typeof Byline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Updated: Story = {
  name: "With an update timestamp",
  args: {
    updatedAt: "2026-06-30T09:15:00.000Z",
  },
};

export const TwoAuthors: Story = {
  name: "Two authors",
  args: {
    authors: [
      { name: "Jane Doe", href: "/authors/jane-doe", avatarSrc: "https://i.pravatar.cc/150?u=jane-doe" },
      { name: "Sam Lee", href: "/authors/sam-lee", avatarSrc: "https://i.pravatar.cc/150?u=sam-lee" },
    ],
  },
};

export const ThreeAuthors: Story = {
  name: "Three authors (Oxford comma)",
  args: {
    authors: [
      { name: "Jane Doe", href: "/authors/jane-doe" },
      { name: "Sam Lee", href: "/authors/sam-lee" },
      { name: "Omar Torres", href: "/authors/omar-torres" },
    ],
  },
};

export const NoAvatar: Story = {
  name: "No avatar",
  args: {
    showAvatar: false,
  },
};

export const NoAuthorLink: Story = {
  name: "Author without a profile link",
  args: {
    authors: [{ name: "Wire Service Staff" }],
    showAvatar: false,
  },
};
