import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { BreakingNewsBanner } from "./BreakingNewsBanner";

const meta: Meta<typeof BreakingNewsBanner> = {
  title: "Patterns/Editorial/Breaking News Banner",
  component: BreakingNewsBanner,
  args: {
    headline: "Central bank announces emergency rate cut amid market turmoil",
    href: "/world/central-bank-emergency-rate-cut",
    onDismiss: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof BreakingNewsBanner>;

export const Default: Story = {};

export const CustomLabel: Story = {
  name: "Custom label text",
  args: { label: "Live" },
};

export const LongHeadline: Story = {
  name: "Long headline (truncates)",
  args: {
    headline:
      "Officials confirm sweeping changes to national infrastructure spending plan following weeks of closed-door negotiations between coalition leaders",
  },
  render: (args) => (
    <div className="max-w-lg">
      <BreakingNewsBanner {...args} />
    </div>
  ),
};
