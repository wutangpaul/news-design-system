import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  args: {
    children: "Markets rallied Thursday after the central bank signaled a pause in rate increases.",
  },
  argTypes: {
    as: { control: "select", options: ["p", "span", "div"] },
    size: { control: "select", options: ["caption", "small", "body", "lead"] },
    color: { control: "select", options: ["primary", "secondary", "tertiary"] },
    weight: { control: "select", options: ["regular", "medium", "semibold", "bold"] },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex max-w-prose flex-col gap-3">
      <Text {...args} size="lead">
        Lead — sets the scene for a story, slightly larger than body copy.
      </Text>
      <Text {...args} size="body">
        Body — the default size for article copy and long-form reading.
      </Text>
      <Text {...args} size="small">
        Small — secondary information, metadata-adjacent copy.
      </Text>
      <Text {...args} size="caption">
        Caption — image captions, fine print, timestamps.
      </Text>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex max-w-prose flex-col gap-2">
      <Text {...args} color="primary">
        Primary — main reading text color.
      </Text>
      <Text {...args} color="secondary">
        Secondary — de-emphasized supporting text.
      </Text>
      <Text {...args} color="tertiary">
        Tertiary — lowest-emphasis text, e.g. timestamps.
      </Text>
    </div>
  ),
};

export const PolymorphicAs: Story = {
  name: "Polymorphic `as`",
  render: (args) => (
    <Text {...args} as="div">
      Rendered as a <code className="font-mono text-small">div</code> instead of a{" "}
      <code className="font-mono text-small">p</code>.
    </Text>
  ),
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
  render: (args) => (
    <div className="flex max-w-prose flex-col gap-2 bg-surface-canvas p-4">
      <Text {...args} color="primary">
        Primary in dark mode
      </Text>
      <Text {...args} color="secondary">
        Secondary in dark mode
      </Text>
    </div>
  ),
};
