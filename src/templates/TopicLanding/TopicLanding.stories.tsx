import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopicLanding } from "./TopicLanding";
import type { TopicLandingProps } from "./TopicLanding";
import { TopicCollections, type TopicCollectionArticle } from "@/patterns/TopicCollections";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { Button } from "@/components/Button";
import { Share, Bookmark, ExternalLink } from "@/components/Icon";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

const midtermsArticles: TopicCollectionArticle[] = [
  {
    id: "1",
    headline: "Five races that could flip control of the Senate",
    href: "https://example.com/articles/senate-races",
    thumbnailSrc: "https://picsum.photos/seed/midterms-1/640/360",
    thumbnailAlt: "A campaign volunteer canvassing a neighborhood",
    label: "Analysis",
  },
  {
    id: "2",
    headline: "What redrawn districts mean for turnout",
    href: "https://example.com/articles/redistricting",
    thumbnailSrc: "https://picsum.photos/seed/midterms-2/640/360",
    thumbnailAlt: "A map of newly redrawn voting districts",
  },
  {
    id: "3",
    headline: "Inside the ad spending arms race",
    href: "https://example.com/articles/ad-spending",
    thumbnailSrc: "https://picsum.photos/seed/midterms-3/640/360",
    thumbnailAlt: "A television studio preparing a campaign advertisement",
    label: "Explainer",
  },
  {
    id: "4",
    headline: "The suburban districts both parties are chasing",
    href: "https://example.com/articles/suburban-districts",
    thumbnailSrc: "https://picsum.photos/seed/midterms-4/640/360",
    thumbnailAlt: "A row of suburban houses with campaign yard signs",
  },
  {
    id: "5",
    headline: "Opinion: Why turnout, not persuasion, will decide this cycle",
    href: "https://example.com/articles/turnout-opinion",
    thumbnailSrc: "https://picsum.photos/seed/midterms-5/640/360",
    thumbnailAlt: "A line of voters waiting outside a polling place",
    label: "Opinion",
  },
  {
    id: "6",
    headline: "Live results: Follow every race as polls close",
    href: "https://example.com/articles/live-results",
    thumbnailSrc: "https://picsum.photos/seed/midterms-6/640/360",
    thumbnailAlt: "A newsroom election-night results board",
    label: "Live",
  },
];

const meta = {
  title: "Templates/Topic Landing",
  component: TopicLanding,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TopicLanding>;

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

/** Wraps `TopicLanding` with local state so the follow button is interactive in the story. */
function FollowableTopicLanding(args: TopicLandingProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  return (
    <TopicLanding
      {...args}
      isFollowing={isFollowing}
      onFollowTopic={() => setIsFollowing((current) => !current)}
    />
  );
}

export const Default: Story = {
  args: {
    ...sharedChrome,
    topicName: "2026 Midterms: Full Coverage",
    description:
      "Everything our politics desk is reporting ahead of November, updated as the races develop.",
    content: (
      <TopicCollections
        topic="Latest coverage"
        articles={midtermsArticles}
      />
    ),
  },
  render: (args) => <FollowableTopicLanding {...args} />,
};

export const WithoutFollowAction: Story = {
  name: "Without a follow action",
  args: {
    ...sharedChrome,
    topicName: "Understanding Interest Rates",
    description: "A standing explainer hub for how central bank decisions ripple through the economy.",
    content: (
      <TopicCollections
        topic="Explainers in this series"
        articles={midtermsArticles.slice(0, 3)}
      />
    ),
  },
};
