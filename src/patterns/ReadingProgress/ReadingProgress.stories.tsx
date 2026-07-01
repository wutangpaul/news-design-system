import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { ReadingProgress } from "./ReadingProgress";

const paragraphs = Array.from({ length: 24 }, (_, i) => (
  <Text as="p" key={i} className="mb-4">
    Paragraph {i + 1}. Scroll this canvas to see the bar above fill in as you move through
    the article — it tracks scroll position against the full scrollable height of the page.
  </Text>
));

const meta = {
  title: "Patterns/Editorial/Reading Progress",
  component: ReadingProgress,
  parameters: {
    layout: "fullscreen",
    // The bar is fixed to the viewport, so a screenshot at rest can't show
    // scroll-driven motion — axe/visual snapshots below check it at 0%.
  },
} satisfies Meta<typeof ReadingProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <ReadingProgress />
      <div className="mx-auto max-w-2xl p-8 pt-16">
        <Heading level={1} className="mb-6">
          Scroll to see progress
        </Heading>
        {paragraphs}
      </div>
    </div>
  ),
};

export const TrackingAnArticleElement: Story = {
  name: "Tracking a specific article element",
  render: function TrackingArticle() {
    const articleRef = useRef<HTMLElement>(null);
    return (
      <div>
        <ReadingProgress targetRef={articleRef} label="Article reading progress" />
        <div className="mx-auto max-w-2xl p-8 pt-16">
          <Text className="mb-8 text-text-tertiary">
            Unrelated intro content above the article — not counted toward progress.
          </Text>
          <article ref={articleRef}>
            <Heading level={1} className="mb-6">
              Article title
            </Heading>
            {paragraphs}
          </article>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <div className="relative h-6">
        <ReadingProgress className="static" size="sm" label="Small" />
      </div>
      <div className="relative h-6">
        <ReadingProgress className="static" size="md" label="Medium" />
      </div>
      <div className="relative h-6">
        <ReadingProgress className="static" size="lg" label="Large" />
      </div>
    </div>
  ),
};
