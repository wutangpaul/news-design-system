import type { Meta, StoryObj } from "@storybook/react-vite";
import { Caption } from "./Caption";

const meta = {
  title: "Patterns/Editorial/Caption",
  component: Caption,
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <figure className="max-w-md">
      <div className="aspect-[3/2] rounded-md bg-surface-sunken" aria-hidden="true" />
      <Caption {...args} />
    </figure>
  ),
} satisfies Meta<typeof Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Firefighters battling a blaze on Main Street early Tuesday morning.",
    credit: "Jane Doe/Wire Service",
  },
};

export const DescriptionOnly: Story = {
  name: "Description only (no credit)",
  args: {
    children: "The city council chamber before Tuesday's vote.",
  },
};

export const CreditOnly: Story = {
  name: "Credit only (no description)",
  args: {
    credit: "Jane Doe/Wire Service",
  },
};

export const Empty: Story = {
  name: "Neither given (renders nothing)",
  args: {},
};
