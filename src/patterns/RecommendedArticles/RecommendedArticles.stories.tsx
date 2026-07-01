import type { Meta, StoryObj } from "@storybook/react-vite";
import { RecommendedArticles, type RecommendedArticle } from "./RecommendedArticles";

const meta = {
  title: "Patterns/Content Discovery/Recommended Articles",
  component: RecommendedArticles,
} satisfies Meta<typeof RecommendedArticles>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleArticles: RecommendedArticle[] = [
  {
    id: "1",
    headline: "How newsrooms are rethinking the morning briefing",
    href: "https://example.com/articles/morning-briefing",
    thumbnailSrc: "https://picsum.photos/seed/recart-1/640/360",
    thumbnailAlt: "A newsroom editor reviewing the day's top stories on a monitor",
    category: "Media",
  },
  {
    id: "2",
    headline: "The quiet return of the local bookstore",
    href: "https://example.com/articles/local-bookstores",
    thumbnailSrc: "https://picsum.photos/seed/recart-2/640/360",
    thumbnailAlt: "Shelves of books inside a small independent bookstore",
    category: "Culture",
  },
  {
    id: "3",
    headline: "Inside the race to build a better home battery",
    href: "https://example.com/articles/home-battery",
    thumbnailSrc: "https://picsum.photos/seed/recart-3/640/360",
    thumbnailAlt: "A technician inspecting a residential battery storage unit",
    category: "Technology",
  },
  {
    id: "4",
    headline: "What three seasons of drought mean for the harvest",
    href: "https://example.com/articles/drought-harvest",
    thumbnailSrc: "https://picsum.photos/seed/recart-4/640/360",
    thumbnailAlt: "A farmer walking across a cracked, dry field",
    category: "Climate",
  },
];

export const Default: Story = {
  args: {
    articles: sampleArticles,
  },
};

export const CustomTitle: Story = {
  name: "Custom section title",
  args: {
    title: "Because you read about the economy",
    articles: sampleArticles.slice(0, 3),
  },
};

export const Empty: Story = {
  name: "Empty state",
  args: {
    articles: [],
  },
};
