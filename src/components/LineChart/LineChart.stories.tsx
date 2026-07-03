import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./LineChart";

const meta = {
  title: "Components/LineChart",
  component: LineChart,
  parameters: { layout: "padded" },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof LineChart>;

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
      <LineChart
        title="Daily pageviews, last 7 days"
        categories={days}
        series={[{ label: "Pageviews", values: [12400, 13100, 12800, 15200, 18900, 21300, 17600], colorIndex: 0 }]}
      />
    </div>
  ),
};

export const MultiSeries: Story = {
  render: () => (
    <div className="max-w-2xl">
      <LineChart
        title="Pageviews by platform, last 7 days"
        categories={days}
        series={[
          { label: "Desktop", values: [8200, 8600, 8100, 9200, 10400, 11800, 9600], colorIndex: 0 },
          { label: "Mobile", values: [4200, 4500, 4700, 6000, 8500, 9500, 8000], colorIndex: 1 },
        ]}
      />
    </div>
  ),
};

export const DarkMode: Story = {
  ...MultiSeries,
  parameters: { ...meta.parameters, backgrounds: { default: "dark" } },
  globals: { theme: "dark" },
};

export const CustomValueFormat: Story = {
  render: () => (
    <div className="max-w-2xl">
      <LineChart
        title="Subscription revenue, last 7 days"
        categories={days}
        valueFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
        series={[{ label: "Revenue", values: [4200, 4600, 4300, 5100, 6200, 7100, 6400], colorIndex: 3 }]}
      />
    </div>
  ),
};
