import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trending } from "./Trending";
import type { TrendingItem } from "./Trending";

const meta = {
  title: "Patterns/Content Discovery/Trending",
  component: Trending,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Trending>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: TrendingItem[] = [
  {
    headline: "Central bank signals possible rate cut",
    href: "https://example.com/story/rate-cut",
    timestamp: "Updated 12 minutes ago",
  },
  {
    headline: "Startup unveils home battery breakthrough",
    href: "https://example.com/story/battery-breakthrough",
    timestamp: "Updated 20 minutes ago",
  },
  {
    headline: "Championship game heads into overtime",
    href: "https://example.com/story/championship-overtime",
    timestamp: "Updated 25 minutes ago",
  },
  {
    headline: "New study links sleep and productivity",
    href: "https://example.com/story/sleep-study",
    timestamp: "Updated 40 minutes ago",
  },
];

export const Default: Story = {
  args: {
    items,
    subtitle: "Updated every few minutes",
  },
  render: (args) => (
    <div className="max-w-sm">
      <Trending {...args} />
    </div>
  ),
};

export const WithThumbnails: Story = {
  name: "With thumbnails (showImages)",
  args: {
    items: items.map((item, index) => ({
      ...item,
      imageSrc: `https://picsum.photos/seed/trending-${index}/200/200`,
      imageAlt: "",
    })),
    subtitle: "Updated every few minutes",
    showImages: true,
  },
  render: (args) => (
    <div className="max-w-sm">
      <Trending {...args} />
    </div>
  ),
};
