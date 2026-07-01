import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReadingTime } from "./ReadingTime";

const meta = {
  title: "Patterns/Editorial/Reading Time",
  component: ReadingTime,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ReadingTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    minutes: 6,
  },
};

export const FromWordCount: Story = {
  name: "Derived from word count",
  args: {
    wordCount: 1450,
  },
};

export const ShortRead: Story = {
  name: "Sub-minute word count rounds up to 1",
  args: {
    wordCount: 80,
  },
};

export const Sizes: Story = {
  args: {
    minutes: 4,
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <ReadingTime minutes={4} size="caption" />
      <ReadingTime minutes={4} size="small" />
      <ReadingTime minutes={4} size="body" />
    </div>
  ),
};
