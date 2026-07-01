import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Skeleton {...args} />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Skeleton shape="text" />
      <Skeleton shape="circle" />
      <Skeleton shape="rect" />
    </div>
  ),
};

export const ArticleCardSkeleton: Story = {
  name: "Composed: article card placeholder",
  render: () => (
    <div
      role="status"
      aria-live="polite"
      className="flex max-w-sm flex-col gap-3"
    >
      <span className="sr-only">Loading article…</span>
      <Skeleton shape="rect" className="h-40 w-full" />
      <Skeleton shape="text" className="h-5 w-3/4" />
      <Skeleton shape="text" className="h-4 w-full" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton shape="circle" className="h-8 w-8" />
        <Skeleton shape="text" className="h-3 w-24" />
      </div>
    </div>
  ),
};
