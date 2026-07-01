import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  args: {
    href: "https://example.com",
    children: "the latest reporting",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["inline", "standalone"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  render: (args) => (
    <p className="max-w-prose text-text-primary text-body">
      Subscribers can read <Link {...args} /> on this story as it develops.
    </p>
  ),
};

export const Standalone: Story = {
  args: { tone: "standalone", children: "Full coverage: 2026 budget negotiations" },
  render: (args) => <Link {...args} />,
};

export const External: Story = {
  args: { external: true, children: "View the original filing" },
  render: (args) => (
    <p className="max-w-prose text-text-primary text-body">
      Read more in the <Link {...args} /> published by the regulator.
    </p>
  ),
};

export const Visited: Story = {
  name: "Visited state",
  render: () => (
    <p className="max-w-prose text-text-primary text-body">
      Visit{" "}
      <a
        href="https://example.com"
        className="rounded-sm font-sans text-masthead-600 underline underline-offset-4 visited:text-text-tertiary"
      >
        this link
      </a>{" "}
      — open it once in a real browser to see the dimmed visited color (Storybook can&apos;t
      simulate `:visited` state directly).
    </p>
  ),
};
