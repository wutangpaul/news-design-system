import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopicCollections, type TopicCollectionArticle } from "./TopicCollections";

const meta = {
  title: "Patterns/Content Discovery/Topic Collections",
  component: TopicCollections,
} satisfies Meta<typeof TopicCollections>;

export default meta;
type Story = StoryObj<typeof meta>;

const midtermsArticles: TopicCollectionArticle[] = [
  {
    id: "1",
    headline: "Five races that could flip control of the Senate",
    href: "https://example.com/articles/senate-races",
    thumbnailSrc: "https://picsum.photos/seed/topic-1/640/360",
    thumbnailAlt: "A campaign volunteer canvassing a neighborhood",
    label: "Analysis",
  },
  {
    id: "2",
    headline: "What redrawn districts mean for turnout",
    href: "https://example.com/articles/redistricting",
    thumbnailSrc: "https://picsum.photos/seed/topic-2/640/360",
    thumbnailAlt: "A map of newly redrawn voting districts",
  },
  {
    id: "3",
    headline: "Inside the ad spending arms race",
    href: "https://example.com/articles/ad-spending",
    thumbnailSrc: "https://picsum.photos/seed/topic-3/640/360",
    thumbnailAlt: "A television studio preparing a campaign advertisement",
    label: "Explainer",
  },
];

export const Default: Story = {
  args: {
    topic: "2026 Midterms: Full Coverage",
    description:
      "Everything our politics desk is reporting ahead of November, updated as the races develop.",
    articles: midtermsArticles,
  },
};

export const WithoutDescription: Story = {
  name: "Without a description",
  args: {
    topic: "Wildfire Season",
    articles: midtermsArticles.slice(0, 2),
  },
};

export const Empty: Story = {
  name: "Empty state",
  args: {
    topic: "2026 Midterms: Full Coverage",
    articles: [],
  },
};
