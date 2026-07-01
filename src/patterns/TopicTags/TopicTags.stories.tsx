import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TopicTags, type TopicTagItem } from "./TopicTags";

const linkedTopics: TopicTagItem[] = [
  { id: "climate", label: "Climate", href: "/topics/climate" },
  { id: "politics", label: "Politics", href: "/topics/politics" },
  { id: "economy", label: "Economy", href: "/topics/economy" },
];

const manyTopics: TopicTagItem[] = [
  "Climate",
  "Politics",
  "Economy",
  "Technology",
  "Health",
  "Sports",
  "Culture",
  "Science",
].map((label) => ({ id: label.toLowerCase(), label, href: `/topics/${label.toLowerCase()}` }));

const meta: Meta<typeof TopicTags> = {
  title: "Patterns/Editorial/Topic Tags",
  component: TopicTags,
  args: {
    topics: linkedTopics,
  },
};

export default meta;
type Story = StoryObj<typeof TopicTags>;

export const Default: Story = {};

export const InteractiveFilterChips: Story = {
  name: "Interactive filter chips",
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<string | null>("politics");
      const topics: TopicTagItem[] = ["Climate", "Politics", "Economy"].map((label) => {
        const id = label.toLowerCase();
        return {
          id,
          label,
          selected: selected === id,
          onClick: () => setSelected((current) => (current === id ? null : id)),
        };
      });
      return <TopicTags topics={topics} />;
    }
    return <Demo />;
  },
};

export const ShowMore: Story = {
  name: "With a show-more toggle",
  args: {
    topics: manyTopics,
    maxVisible: 4,
  },
};
