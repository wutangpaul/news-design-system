import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart";

const meta = {
  title: "Components/BarChart",
  component: BarChart,
  parameters: { layout: "padded" },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof BarChart>;

const categories = ["Politics", "Business", "World", "Culture", "Opinion"];

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
      <BarChart
        title="Pageviews by section, this week"
        categories={categories}
        series={[{ label: "Pageviews", values: [42000, 38500, 51200, 29800, 33400], colorIndex: 0 }]}
      />
    </div>
  ),
};

export const GroupedSeries: Story = {
  render: () => (
    <div className="max-w-2xl">
      <BarChart
        title="Pageviews by section, this week vs. last week"
        categories={categories}
        series={[
          { label: "This week", values: [42000, 38500, 51200, 29800, 33400], colorIndex: 0 },
          { label: "Last week", values: [39500, 40200, 47800, 31200, 30100], colorIndex: 1 },
        ]}
      />
    </div>
  ),
};

export const DarkMode: Story = {
  ...GroupedSeries,
  parameters: { ...meta.parameters, backgrounds: { default: "dark" } },
  globals: { theme: "dark" },
};
