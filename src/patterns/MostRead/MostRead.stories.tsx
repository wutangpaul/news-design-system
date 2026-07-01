import type { Meta, StoryObj } from "@storybook/react-vite";
import { MostRead } from "./MostRead";
import type { MostReadItem } from "./MostRead";

const meta = {
  title: "Patterns/Content Discovery/Most Read",
  component: MostRead,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof MostRead>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: MostReadItem[] = [
  {
    headline: "City council approves new transit budget",
    href: "https://example.com/story/transit-budget",
    byline: "By Jane Doe",
    timestamp: "3 hours ago",
    imageSrc: "https://picsum.photos/seed/transit/200/200",
    imageAlt: "A light-rail train",
  },
  {
    headline: "Local bakery wins national pastry award",
    href: "https://example.com/story/bakery-award",
    byline: "By Sam Lee",
    timestamp: "5 hours ago",
    imageSrc: "https://picsum.photos/seed/bakery/200/200",
    imageAlt: "Fresh pastries in a display case",
  },
  {
    headline: "Opinion: Why local newsrooms still matter",
    href: "https://example.com/story/local-newsrooms",
    byline: "By Alex Rivera",
    timestamp: "Yesterday",
  },
  {
    headline: "Weekend weather turns unseasonably warm",
    href: "https://example.com/story/weather",
    timestamp: "2 hours ago",
  },
  {
    headline: "School district unveils new literacy program",
    href: "https://example.com/story/literacy-program",
    byline: "By Priya Nair",
    timestamp: "1 day ago",
  },
];

export const Default: Story = {
  args: {
    items,
    subtitle: "Past 24 hours",
  },
  render: (args) => (
    <div className="max-w-sm">
      <MostRead {...args} />
    </div>
  ),
};

export const WithThumbnails: Story = {
  name: "With thumbnails (showImages)",
  args: {
    items,
    subtitle: "Past 24 hours",
    showImages: true,
  },
  render: (args) => (
    <div className="max-w-sm">
      <MostRead {...args} />
    </div>
  ),
};

export const CustomTitle: Story = {
  name: "Custom title",
  args: {
    title: "Most Popular This Week",
    items: items.slice(0, 3),
  },
  render: (args) => (
    <div className="max-w-sm">
      <MostRead {...args} />
    </div>
  ),
};
