import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineImage } from "./InlineImage";

const meta = {
  title: "Patterns/Editorial/Inline Image",
  component: InlineImage,
  parameters: {
    layout: "padded",
  },
  args: {
    src: "https://picsum.photos/seed/inline-image/960/540",
    alt: "Aerial view of a city skyline at dusk",
    caption: "The skyline as seen from the harbor bridge on Tuesday evening.",
    credit: "Jane Doe/Wire Service",
  },
} satisfies Meta<typeof InlineImage>;

export default meta;
type Story = StoryObj<typeof meta>;

const bodyText =
  "Reporters gathered downtown as the city council prepared to vote on the new zoning " +
  "proposal. Residents lined up outside the chamber hours before doors opened, many " +
  "carrying signs in support of or opposition to the plan. Council members said they " +
  "expected the vote to be close, with several undecided members citing concerns raised " +
  "during last month's public comment period.";

export const Default: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <InlineImage {...args} align="full" aspectRatio="16/9" />
    </div>
  ),
};

export const Centered: Story = {
  name: "Align — center",
  render: (args) => (
    <div className="max-w-2xl">
      <InlineImage {...args} align="center" aspectRatio="4/3" />
    </div>
  ),
};

export const InsetLeft: Story = {
  name: "Align — inset-left (text wraps around)",
  render: (args) => (
    <div className="max-w-2xl text-body text-text-primary">
      <InlineImage {...args} align="inset-left" aspectRatio="4/3" />
      <p>{bodyText}</p>
      <p>{bodyText}</p>
    </div>
  ),
};

export const InsetRight: Story = {
  name: "Align — inset-right (text wraps around)",
  render: (args) => (
    <div className="max-w-2xl text-body text-text-primary">
      <InlineImage {...args} align="inset-right" aspectRatio="4/3" />
      <p>{bodyText}</p>
      <p>{bodyText}</p>
    </div>
  ),
};

export const NoCaption: Story = {
  name: "No caption or credit",
  render: (args) => (
    <div className="max-w-2xl">
      <InlineImage {...args} caption={undefined} credit={undefined} align="full" />
    </div>
  ),
};
