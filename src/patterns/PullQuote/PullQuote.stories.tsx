import type { Meta, StoryObj } from "@storybook/react";
import { PullQuote } from "./PullQuote";

const meta = {
  title: "Patterns/Editorial/Pull Quote",
  component: PullQuote,
  args: {
    quote: "We rebuilt everything twice — once for the flood, once for the flood after that.",
  },
  argTypes: {
    align: { control: "select", options: ["left", "center"] },
  },
} satisfies Meta<typeof PullQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quote: "We rebuilt everything twice — once for the flood, once for the flood after that.",
    attribution: "Mara Diallo, town engineer",
  },
};

export const WithoutAttribution: Story = {
  name: "Without attribution",
  args: {
    quote: "The funding gap isn't a detail. It's the whole story.",
  },
};

export const Centered: Story = {
  args: {
    quote: "Three counties still haven't broken ground on their sea walls.",
    attribution: "Coastal Resilience Office",
    align: "center",
  },
};

export const InArticleContext: Story = {
  name: "In article context",
  render: () => (
    <div className="mx-auto flex max-w-[65ch] flex-col gap-6 font-sans text-body text-text-primary">
      <p>
        Engineers say the new barriers should hold, but funding gaps have delayed work
        in three of the six affected counties, raising questions about whether the
        region will be ready before the next storm season.
      </p>
      <PullQuote
        quote="We rebuilt everything twice — once for the flood, once for the flood after that."
        attribution="Mara Diallo, town engineer"
      />
      <p>
        County officials say a supplemental budget request is under review, though it
        is unlikely to reach the floor before the current session ends.
      </p>
    </div>
  ),
};

export const DarkMode: Story = {
  name: "Dark mode",
  globals: { theme: "dark" },
  args: {
    quote: "We rebuilt everything twice — once for the flood, once for the flood after that.",
    attribution: "Mara Diallo, town engineer",
  },
};
