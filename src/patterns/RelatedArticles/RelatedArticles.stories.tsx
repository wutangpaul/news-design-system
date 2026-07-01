import type { Meta, StoryObj } from "@storybook/react";
import { RelatedArticles, type RelatedArticle } from "./RelatedArticles";

const sampleArticles: RelatedArticle[] = [
  {
    id: "1",
    href: "#",
    title: "City council approves downtown transit overhaul",
    imageSrc: "https://picsum.photos/seed/related-1/640/360",
    imageAlt: "Buses lined up at a downtown transit hub.",
    category: "Local",
  },
  {
    id: "2",
    href: "#",
    title: "What the new tariffs mean for grocery prices",
    imageSrc: "https://picsum.photos/seed/related-2/640/360",
    imageAlt: "A shopper reviewing a grocery receipt.",
    category: "Business",
  },
  {
    id: "3",
    href: "#",
    title: "Local team clinches playoff spot after overtime win",
    imageSrc: "https://picsum.photos/seed/related-3/640/360",
    imageAlt: "A crowded stadium at night.",
    category: "Sports",
  },
];

const meta = {
  title: "Patterns/Editorial/Related Articles",
  component: RelatedArticles,
  parameters: {
    layout: "padded",
  },
  args: {
    articles: sampleArticles,
  },
} satisfies Meta<typeof RelatedArticles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomHeading: Story = {
  args: {
    heading: "More on this story",
    headingLevel: 3,
  },
};

const articlesWithoutCategories: RelatedArticle[] = sampleArticles.map((article) => ({
  id: article.id,
  href: article.href,
  title: article.title,
  imageSrc: article.imageSrc,
  imageAlt: article.imageAlt,
}));

export const WithoutCategories: Story = {
  args: {
    articles: articlesWithoutCategories,
  },
};

export const TwoArticles: Story = {
  args: {
    articles: sampleArticles.slice(0, 2),
  },
};
