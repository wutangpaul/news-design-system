import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlockQuote } from "./BlockQuote";

const meta = {
  title: "Patterns/Editorial/Block Quote",
  component: BlockQuote,
  args: {
    quote: "We knew the levee wouldn't hold, but we didn't have the budget to say so publicly.",
  },
} satisfies Meta<typeof BlockQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quote: "We knew the levee wouldn't hold, but we didn't have the budget to say so publicly.",
    attribution: "Mara Diallo, town engineer",
  },
};

export const WithoutAttribution: Story = {
  name: "Without attribution",
  args: {
    quote: "The funding gap isn't a detail. It's the whole story.",
  },
};

export const WithSourceUrl: Story = {
  name: "With a source cite URL",
  args: {
    quote: "The funding gap isn't a detail. It's the whole story.",
    attribution: "Coastal Resilience Office, public statement",
    cite: "https://example.com/statements/2026-06-30",
  },
};

export const InArticleContext: Story = {
  name: "In article context",
  render: () => (
    <div className="mx-auto flex max-w-[65ch] flex-col gap-6 font-sans text-body text-text-primary">
      <p>
        In an interview conducted the week before the storm, the town lead engineer
        described the pressure of communicating risk to residents who had already lived
        through two floods.
      </p>
      <BlockQuote
        quote="We knew the levee wouldn't hold, but we didn't have the budget to say so publicly."
        attribution="Mara Diallo, town engineer"
      />
      <p>
        She resigned three months later, citing the same funding gap the council is now
        being asked to close.
      </p>
    </div>
  ),
};

export const DarkMode: Story = {
  name: "Dark mode",
  globals: { theme: "dark" },
  args: {
    quote: "We knew the levee wouldn't hold, but we didn't have the budget to say so publicly.",
    attribution: "Mara Diallo, town engineer",
  },
};
