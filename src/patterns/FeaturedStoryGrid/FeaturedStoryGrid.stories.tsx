import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeaturedStoryGrid } from "./FeaturedStoryGrid";
import type { FeaturedStoryGridItem } from "./FeaturedStoryGrid";

const meta = {
  title: "Patterns/Content Discovery/Featured Story Grid",
  component: FeaturedStoryGrid,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof FeaturedStoryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const stories: FeaturedStoryGridItem[] = [
  {
    headline: "City council approves new transit budget",
    href: "https://example.com/story/transit-budget",
    dek: "The $2.4 billion plan funds four new light-rail lines over the next decade, with construction beginning next spring and continuing through the following several years of build-out.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/transit/1200/675",
    imageAlt: "A light-rail train pulling into a downtown station",
    byline: "By Jane Doe",
    timestamp: "3 hours ago",
    featured: true,
  },
  {
    headline: "Local bakery wins national pastry award",
    href: "https://example.com/story/bakery-award",
    dek: "A third-generation family business took home the top prize at this year's ceremony.",
    category: "Food",
    imageSrc: "https://picsum.photos/seed/bakery/800/600",
    imageAlt: "Fresh pastries arranged in a bakery display case",
    byline: "By Sam Lee",
    timestamp: "5 hours ago",
  },
  {
    headline: "Opinion: Why local newsrooms still matter",
    href: "https://example.com/story/local-newsrooms",
    dek: "As national outlets consolidate, community reporting fills a widening gap.",
    category: "Opinion",
    imageSrc: "https://picsum.photos/seed/newsroom/800/600",
    imageAlt: "A newsroom filled with reporters at their desks",
    byline: "By Alex Rivera",
    timestamp: "Yesterday",
  },
  {
    headline: "Weekend weather turns unseasonably warm",
    href: "https://example.com/story/weather",
    dek: "Forecasters expect the warm spell to break by Monday morning.",
    category: "Weather",
    imageSrc: "https://picsum.photos/seed/weather/800/600",
    imageAlt: "A sunny sky over a city skyline",
    byline: "By Weather Desk",
    timestamp: "2 hours ago",
  },
  {
    headline: "School district unveils new literacy program",
    href: "https://example.com/story/literacy-program",
    dek: "The pilot will start in ten elementary schools this fall.",
    category: "Education",
    byline: "By Priya Nair",
    timestamp: "1 day ago",
  },
];

export const Default: Story = {
  args: { stories },
};

export const NoFeaturedItem: Story = {
  name: "Uniform grid (no featured item)",
  args: {
    stories: stories.map((story) => ({ ...story, featured: false })),
  },
};

export const TextOnlyItems: Story = {
  name: "Mixed image / text-only items",
  args: {
    stories: stories.map((story, index) =>
      index % 2 === 1 ? { ...story, imageSrc: undefined } : story,
    ),
  },
};
