import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryCard } from "./StoryCard";
import type { StoryCardContent } from "./StoryCard";

const meta = {
  title: "Patterns/Content Discovery/Story Card",
  component: StoryCard,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof StoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullStory: StoryCardContent = {
  headline: "City council approves new transit budget",
  href: "https://example.com/story/transit-budget",
  dek: "The $2.4 billion plan funds four new light-rail lines over the next decade, with construction beginning next spring.",
  category: "Politics",
  imageSrc: "https://picsum.photos/seed/transit/800/600",
  imageAlt: "A light-rail train pulling into a downtown station",
  byline: "By Jane Doe",
  timestamp: "3 hours ago",
  timestampDateTime: "2026-06-30T09:00:00Z",
};

const textOnlyStory: StoryCardContent = {
  headline: "Opinion: Why local newsrooms still matter",
  href: "https://example.com/story/local-newsrooms",
  dek: "As national outlets consolidate, community reporting fills a widening gap.",
  category: "Opinion",
  byline: "By Alex Rivera",
  timestamp: "Yesterday",
};

export const Default: Story = {
  args: {
    story: fullStory,
  },
  render: (args) => (
    <div className="max-w-sm">
      <StoryCard {...args} />
    </div>
  ),
};

export const Horizontal: Story = {
  args: {
    story: fullStory,
    layout: "horizontal",
  },
  render: (args) => (
    <div className="max-w-lg">
      <StoryCard {...args} />
    </div>
  ),
};

export const TextOnly: Story = {
  name: "No image (text-only)",
  args: {
    story: textOnlyStory,
  },
  render: (args) => (
    <div className="max-w-sm">
      <StoryCard {...args} />
    </div>
  ),
};

export const WithoutLink: Story = {
  name: "Static (no href)",
  args: {
    story: { ...fullStory, href: undefined },
  },
  render: (args) => (
    <div className="max-w-sm">
      <StoryCard {...args} />
    </div>
  ),
};

export const SideBySideLayouts: Story = {
  name: "Vertical vs horizontal",
  args: {
    story: fullStory,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="max-w-sm">
        <StoryCard story={fullStory} layout="vertical" />
      </div>
      <div className="max-w-lg">
        <StoryCard story={fullStory} layout="horizontal" />
      </div>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => (
    <div className="max-w-sm">
      <StoryCard {...args} />
    </div>
  ),
};

export const LoadingHorizontal: Story = {
  name: "Loading (horizontal)",
  args: {
    loading: true,
    layout: "horizontal",
  },
  render: (args) => (
    <div className="max-w-lg">
      <StoryCard {...args} />
    </div>
  ),
};

export const LoadingSideBySide: Story = {
  name: "Loading: vertical vs horizontal",
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="max-w-sm">
        <StoryCard loading layout="vertical" />
      </div>
      <div className="max-w-lg">
        <StoryCard loading layout="horizontal" />
      </div>
    </div>
  ),
};

export const EqualHeightRow: Story = {
  name: "Equal-height row (grid usage)",
  args: {
    story: fullStory,
  },
  render: () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <StoryCard story={fullStory} />
      <StoryCard story={textOnlyStory} />
      <StoryCard
        story={{
          ...fullStory,
          headline: "Short headline",
          dek: undefined,
        }}
      />
    </div>
  ),
};
