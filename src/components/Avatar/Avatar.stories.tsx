import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: {
    name: "Jane Doe",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://i.pravatar.cc/150?u=jane-doe",
  },
};

export const InitialsFallback: Story = {
  name: "Initials fallback (no src)",
  args: {},
};

export const BrokenImage: Story = {
  name: "Broken image falls back to initials",
  args: {
    src: "https://example.invalid/broken-avatar.jpg",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar name="Xena Q" size="xs" />
      <Avatar name="Sam K" size="sm" />
      <Avatar name="Jane Doe" size="md" />
      <Avatar name="Lee Park" size="lg" />
      <Avatar name="Omar T" size="xl" />
    </div>
  ),
};

export const StatusOnline: Story = {
  name: "Status — online",
  args: {
    src: "https://i.pravatar.cc/150?u=online-user",
    status: "online",
  },
};

export const StatusOffline: Story = {
  name: "Status — offline",
  args: {
    status: "offline",
  },
};
