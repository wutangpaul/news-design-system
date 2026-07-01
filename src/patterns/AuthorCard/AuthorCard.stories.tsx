import type { Meta, StoryObj } from "@storybook/react";
import { AuthorCard } from "./AuthorCard";

const meta = {
  title: "Patterns/Editorial/Author Card",
  component: AuthorCard,
  parameters: {
    layout: "padded",
  },
  args: {
    name: "Jane Doe",
    avatarSrc: "https://i.pravatar.cc/150?u=jane-doe",
    title: "Politics Reporter",
    bio: "Jane covers city hall and state politics. She previously reported on the statehouse for a decade before joining the newsroom.",
    href: "/authors/jane-doe",
    socialLinks: [
      { label: "Twitter", href: "https://twitter.com/janedoe" },
      { label: "Email", href: "mailto:jane.doe@example.com", external: false },
    ],
  },
  render: (args) => (
    <div className="max-w-lg">
      <AuthorCard {...args} />
    </div>
  ),
} satisfies Meta<typeof AuthorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ProfilePage: Story = {
  name: "Standalone profile page (h1)",
  args: {
    headingLevel: 1,
  },
};

export const InlineCallout: Story = {
  name: "Inline 'more from this author' callout (h3)",
  args: {
    headingLevel: 3,
    bio: undefined,
    socialLinks: undefined,
  },
};

export const NoSocialLinks: Story = {
  name: "No social links",
  args: {
    socialLinks: undefined,
  },
};

export const NoAvatar: Story = {
  name: "No photo (initials fallback)",
  args: {
    avatarSrc: undefined,
  },
};

export const NoProfileLink: Story = {
  name: "No profile link (plain text name)",
  args: {
    href: undefined,
  },
};
