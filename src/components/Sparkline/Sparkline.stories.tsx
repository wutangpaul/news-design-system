import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./Sparkline";

const meta = {
  title: "Components/Sparkline",
  component: Sparkline,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof Sparkline>;

const values = [12400, 13100, 12800, 15200, 18900, 21300, 17600];

export const Default: Story = {
  render: () => <Sparkline label="7-day pageviews trend" values={values} />,
};

export const WithTrendColor: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <span className="flex items-center gap-2 text-small text-text-secondary">
        Pageviews, up this week
        <Sparkline label="7-day pageviews, up 42% to 17,600" values={values} showTrend />
      </span>
      <span className="flex items-center gap-2 text-small text-text-secondary">
        Pageviews, down this week
        <Sparkline label="7-day pageviews, down 18% to 9,400" values={[...values].reverse()} showTrend />
      </span>
    </div>
  ),
};

export const InMetadataRow: Story = {
  render: () => (
    <div className="max-w-sm rounded-lg border border-surface-border bg-surface-canvas p-4">
      <p className="text-small font-semibold text-text-primary">Historic drought forces water restrictions</p>
      <div className="mt-2 flex items-center justify-between text-caption text-text-tertiary">
        <span>21,300 views today</span>
        <Sparkline label="7-day pageviews, trending up" values={values} showTrend width={64} height={20} />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  ...WithTrendColor,
  parameters: { ...meta.parameters, backgrounds: { default: "dark" } },
  globals: { theme: "dark" },
};
