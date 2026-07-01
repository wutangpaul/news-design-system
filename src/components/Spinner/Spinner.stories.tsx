import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const CustomLabel: Story = {
  name: "Custom accessible label",
  args: {
    label: "Submitting comment",
  },
};

export const InlineWithText: Story = {
  name: "Inline with text",
  render: () => (
    <span className="inline-flex items-center gap-2 text-small text-text-secondary">
      <Spinner size="sm" />
      Loading more stories…
    </span>
  ),
};
