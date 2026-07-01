import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryLanding } from "./CategoryLanding";
import type { CategoryLandingProps } from "./CategoryLanding";
import { CategoryNavigation, type CategoryNavItem } from "@/patterns/CategoryNavigation";
import { StoryCard, type StoryCardContent } from "@/patterns/StoryCard";
import { FeaturedStoryGrid, type FeaturedStoryGridItem } from "@/patterns/FeaturedStoryGrid";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { Button } from "@/components/Button";
import { Pagination } from "@/components/Pagination";
import { Share, Bookmark, ExternalLink } from "@/components/Icon";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics", current: true },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

const categoryNavItems: CategoryNavItem[] = [
  { label: "World", href: "/world" },
  { label: "Politics", href: "/politics", current: true },
  { label: "Business", href: "/business" },
  { label: "Tech", href: "/tech" },
  { label: "Sports", href: "/sports" },
  { label: "Culture", href: "/culture" },
];

const leadStory: StoryCardContent = {
  headline: "Senate advances bipartisan infrastructure package after late-night deal",
  href: "https://example.com/story/infrastructure-deal",
  dek: "The $180 billion measure now heads to the House, where leadership says a vote could come before the end of the month.",
  category: "Politics",
  imageSrc: "https://picsum.photos/seed/senate/1200/675",
  imageAlt: "The U.S. Capitol building at dusk",
  byline: "By Renata Cole",
  timestamp: "2 hours ago",
};

const categoryStories: FeaturedStoryGridItem[] = [
  {
    headline: "Governor signs order expanding early voting access statewide",
    href: "https://example.com/story/early-voting",
    dek: "The order adds ten days of early voting ahead of the fall election cycle.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/voting/800/600",
    imageAlt: "A row of voting booths in a polling station",
    byline: "By Renata Cole",
    timestamp: "4 hours ago",
  },
  {
    headline: "City council approves $2.4B transit overhaul after marathon session",
    href: "https://example.com/story/transit-budget",
    dek: "Four new light-rail lines break ground next spring.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/transit/800/600",
    imageAlt: "A light-rail train pulling into a downtown station",
    byline: "By Jane Doe",
    timestamp: "5 hours ago",
  },
  {
    headline: "Committee subpoenas records in ongoing procurement inquiry",
    href: "https://example.com/story/procurement-inquiry",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/committee/800/600",
    imageAlt: "An empty committee hearing room",
    byline: "By Alex Rivera",
    timestamp: "6 hours ago",
  },
  {
    headline: "Analysis: What the redistricting ruling means for next year's map",
    href: "https://example.com/story/redistricting-analysis",
    category: "Politics",
    byline: "By Priya Nair",
    timestamp: "Yesterday",
  },
  {
    headline: "Opinion: The case for term limits nobody wants to make",
    href: "https://example.com/story/term-limits-opinion",
    category: "Opinion",
    byline: "By Marcus Webb",
    timestamp: "Yesterday",
  },
  {
    headline: "Freshman lawmakers form new bipartisan working group",
    href: "https://example.com/story/freshman-caucus",
    category: "Politics",
    byline: "By Sam Lee",
    timestamp: "2 days ago",
  },
];

const meta = {
  title: "Templates/Category Landing",
  component: CategoryLanding,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CategoryLanding>;

export default meta;
type Story = StoryObj<typeof meta>;

const sharedChrome = {
  header: {
    logo: <a href="/">The Daily Ledger</a>,
    primaryNavigation: <PrimaryNavigation items={navItems} />,
    search: <SearchExperience onSearch={() => undefined} />,
    actions: (
      <Button variant="primary" size="sm">
        Subscribe
      </Button>
    ),
  },
  footer: {
    logo: "The Daily Ledger",
    groups: [
      {
        heading: "Sections",
        links: [
          { label: "World", href: "/world" },
          { label: "Politics", href: "/politics" },
          { label: "Business", href: "/business" },
          { label: "Culture", href: "/culture" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
        ],
      },
    ],
    socialLinks: [
      { label: "Follow us on X", href: "https://x.com/example", icon: <Share size="sm" /> },
      {
        label: "Follow us on Facebook",
        href: "https://facebook.com/example",
        icon: <Bookmark size="sm" />,
      },
      {
        label: "Visit our newsroom site",
        href: "https://example.com",
        icon: <ExternalLink size="sm" />,
      },
    ],
    copyrightText: "© 2026 The Daily Ledger. All rights reserved.",
  },
};

/** Wraps `CategoryLanding` with local page state so `Pagination` is interactive in the story. */
function DefaultCategoryLanding(args: CategoryLandingProps) {
  const [page, setPage] = useState(1);
  return (
    <CategoryLanding
      {...args}
      pagination={<Pagination page={page} pageCount={8} onPageChange={setPage} />}
    />
  );
}

export const Default: Story = {
  args: {
    ...sharedChrome,
    categoryName: "Politics",
    description: "Elections, policy, and the people making it happen — updated throughout the day.",
    categoryNavigation: <CategoryNavigation items={categoryNavItems} />,
    featured: <StoryCard story={leadStory} layout="vertical" headingLevel={2} />,
    stories: <FeaturedStoryGrid stories={categoryStories} headingLevel={3} />,
  },
  render: (args) => <DefaultCategoryLanding {...args} />,
};

export const SparseSection: Story = {
  name: "Sparse section (no pagination)",
  args: {
    ...sharedChrome,
    categoryName: "Weather",
    description: "Forecasts and conditions for the week ahead.",
    categoryNavigation: (
      <CategoryNavigation
        items={categoryNavItems.map((item) => ({ ...item, current: item.label === "World" }))}
      />
    ),
    featured: (
      <StoryCard
        story={{
          headline: "Weekend weather turns unseasonably warm across the region",
          href: "https://example.com/story/weather",
          dek: "Forecasters expect the warm spell to break by Monday morning.",
          category: "Weather",
          imageSrc: "https://picsum.photos/seed/weather/1200/675",
          imageAlt: "A sunny sky over a city skyline",
          timestamp: "2 hours ago",
        }}
        layout="vertical"
        headingLevel={2}
      />
    ),
    stories: (
      <FeaturedStoryGrid
        stories={[
          {
            headline: "Coastal flood watch issued for low-lying neighborhoods",
            href: "https://example.com/story/flood-watch",
            category: "Weather",
            timestamp: "5 hours ago",
          },
        ]}
        headingLevel={3}
      />
    ),
  },
};
