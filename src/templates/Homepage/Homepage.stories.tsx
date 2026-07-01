import type { Meta, StoryObj } from "@storybook/react-vite";
import { Homepage } from "./Homepage";
import { HeroStory } from "@/patterns/HeroStory";
import { FeaturedStoryGrid, type FeaturedStoryGridItem } from "@/patterns/FeaturedStoryGrid";
import { MostRead, type MostReadItem } from "@/patterns/MostRead";
import { Trending, type TrendingItem } from "@/patterns/Trending";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { Button } from "@/components/Button";
import { Share, Bookmark, ExternalLink } from "@/components/Icon";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/", current: true },
  {
    label: "Politics",
    href: "/politics",
    megaMenuColumns: [
      {
        heading: "Coverage",
        links: [
          { label: "Elections", href: "/politics/elections" },
          { label: "Congress", href: "/politics/congress" },
        ],
      },
    ],
  },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

const featuredStories: FeaturedStoryGridItem[] = [
  {
    headline: "City council approves $2.4B transit overhaul after marathon session",
    href: "https://example.com/story/transit-budget",
    dek: "Four new light-rail lines break ground next spring, with construction continuing through the next decade.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/transit/1200/675",
    imageAlt: "A light-rail train pulling into a downtown station",
    byline: "By Jane Doe",
    timestamp: "3 hours ago",
    featured: true,
  },
  {
    headline: "Central bank holds rates steady, signals cuts by autumn",
    href: "https://example.com/story/rates-hold",
    dek: "Policymakers cited cooling inflation but warned of continued volatility in energy markets.",
    category: "Business",
    imageSrc: "https://picsum.photos/seed/bank/800/600",
    imageAlt: "The central bank's headquarters building",
    byline: "By Marcus Webb",
    timestamp: "5 hours ago",
  },
  {
    headline: "Local bakery wins national pastry award",
    href: "https://example.com/story/bakery-award",
    dek: "A third-generation family business took home the top prize at this year's ceremony.",
    category: "Food",
    imageSrc: "https://picsum.photos/seed/bakery/800/600",
    imageAlt: "Fresh pastries arranged in a bakery display case",
    byline: "By Sam Lee",
    timestamp: "6 hours ago",
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
    headline: "School district unveils new literacy program for ten pilot schools",
    href: "https://example.com/story/literacy-program",
    dek: "The pilot begins this fall, with a district-wide rollout planned for next year.",
    category: "Education",
    byline: "By Priya Nair",
    timestamp: "1 day ago",
  },
];

const mostReadItems: MostReadItem[] = [
  {
    headline: "City council approves $2.4B transit overhaul after marathon session",
    href: "https://example.com/story/transit-budget",
    byline: "By Jane Doe",
    timestamp: "3 hours ago",
  },
  {
    headline: "Central bank holds rates steady, signals cuts by autumn",
    href: "https://example.com/story/rates-hold",
    byline: "By Marcus Webb",
    timestamp: "5 hours ago",
  },
  {
    headline: "Opinion: Why local newsrooms still matter",
    href: "https://example.com/story/local-newsrooms",
    byline: "By Alex Rivera",
    timestamp: "Yesterday",
  },
  {
    headline: "Weekend weather turns unseasonably warm across the region",
    href: "https://example.com/story/weather",
    timestamp: "2 hours ago",
  },
];

const trendingItems: TrendingItem[] = [
  {
    headline: "Championship parade route announced for Saturday",
    href: "https://example.com/story/parade-route",
    timestamp: "1 hour ago",
  },
  {
    headline: "Streaming service raises prices for the third year running",
    href: "https://example.com/story/streaming-prices",
    timestamp: "4 hours ago",
  },
  {
    headline: "New study links commute length to reported job satisfaction",
    href: "https://example.com/story/commute-study",
    timestamp: "7 hours ago",
  },
];

const meta = {
  title: "Templates/Homepage",
  component: Homepage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Homepage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
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
            { label: "Press", href: "/press" },
          ],
        },
        {
          heading: "More",
          links: [
            { label: "Newsletters", href: "/newsletters" },
            { label: "RSS", href: "/rss", external: true },
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
      legalLinks: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    hero: (
      <HeroStory
        title="Historic drought forces sweeping water restrictions across the valley"
        dek="Officials warn the emergency measures could remain in place through next year's growing season as reservoir levels hit record lows."
        category="Environment"
        imageSrc="https://picsum.photos/seed/drought/1600/900"
        imageAlt="A cracked, dry reservoir bed under a wide sky"
        headingLevel={1}
      />
    ),
    featured: <FeaturedStoryGrid stories={featuredStories} headingLevel={2} />,
    sidebar: (
      <>
        <MostRead items={mostReadItems} subtitle="Past 24 hours" headingLevel={2} />
        <Trending items={trendingItems} headingLevel={2} />
      </>
    ),
  },
};

export const WithoutSidebar: Story = {
  name: "Two-region layout (no sidebar)",
  args: {
    ...Default.args,
    sidebar: undefined,
  },
};

export const SparseContent: Story = {
  name: "Sparse content (light news day)",
  args: {
    ...Default.args,
    featured: (
      <FeaturedStoryGrid
        stories={featuredStories.slice(0, 2).map((story) => ({ ...story, featured: false }))}
        headingLevel={2}
      />
    ),
    sidebar: <MostRead items={mostReadItems.slice(0, 2)} headingLevel={2} />,
  },
};
