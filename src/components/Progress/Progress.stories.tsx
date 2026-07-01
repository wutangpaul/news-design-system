import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  args: {
    label: "Upload progress",
    value: 60,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Progress {...args} />
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="max-w-sm">
      <Progress label="Loading" indeterminate />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Progress label="Small" value={45} size="sm" />
      <Progress label="Medium" value={45} size="md" />
      <Progress label="Large" value={45} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Progress label="Brand" value={70} color="brand" />
      <Progress label="Success" value={100} color="success" />
      <Progress label="Warning" value={70} color="warning" />
      <Progress label="Error" value={20} color="error" />
      <Progress label="Info" value={50} color="info" />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="max-w-sm">
      <Progress label="Just started" value={0} />
    </div>
  ),
};

export const Complete: Story = {
  render: () => (
    <div className="max-w-sm">
      <Progress label="Complete" value={100} color="success" />
    </div>
  ),
};
