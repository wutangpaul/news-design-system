import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveBlog } from "./LiveBlog";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { BreakingNewsBanner } from "@/patterns/BreakingNewsBanner";
import { LiveBlogEntry } from "@/patterns/LiveBlogEntry";
import { Byline } from "@/patterns/Byline";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";
import { Share, Bookmark, ExternalLink } from "@/components/Icon";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/", current: false },
  { label: "Politics", href: "/politics", current: true },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

type LiveBlogArgs = ComponentProps<typeof LiveBlog>;

const meta = {
  title: "Templates/Live Blog",
  component: LiveBlog,
  parameters: {
    layout: "fullscreen",
  },
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
      sticky: true,
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
          ],
        },
        {
          heading: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Careers", href: "/careers" },
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
  } satisfies Partial<LiveBlogArgs>,
} satisfies Meta<typeof LiveBlog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A realistic election-night live blog: a breaking-news banner tied to the headline result,
 * a title/context header with byline, a feed status line, and five timestamped entries
 * (newest first) with varied content — a correction/update, a analysis-style update, a plain
 * update, and a "BREAKING" call of the race.
 */
export const Default: Story = {
  args: {
    breakingNewsBanner: (
      <BreakingNewsBanner
        headline="Incumbent concedes Riverdale mayoral race shortly after midnight"
        href="/politics/riverdale-mayoral-concession"
      />
    ),
    pageHeader: (
      <div className="flex flex-col gap-3">
        <Badge variant="error" size="sm" className="w-fit uppercase tracking-wide">
          Live
        </Badge>
        <Heading level={1} visualSize="display">
          Riverdale Mayoral Election: Live Updates
        </Heading>
        <Text as="p" size="lead" color="secondary">
          Follow live results, analysis, and reaction as votes are counted in one of the
          closest mayoral races in Riverdale&apos;s history.
        </Text>
        <Byline
          authors={[{ name: "Priya Nandakumar", href: "/authors/priya-nandakumar" }]}
          publishedAt="2026-06-30T23:00:00Z"
          updatedAt="2026-07-01T00:12:00Z"
        />
      </div>
    ),
    feedStatus: (
      <>
        <span className="font-medium text-text-primary">5 updates</span>
        <span aria-hidden="true">·</span>
        <span>Last updated 12:12am</span>
      </>
    ),
    entries: [
      <LiveBlogEntry
        key="concession"
        timestamp="2026-07-01T00:12:00Z"
        title="Incumbent Mayor Alvarez concedes the race"
        label="breaking"
      >
        Speaking to supporters just after midnight, Mayor Alvarez congratulated challenger Dana
        Whitfield and pledged a smooth transition. &quot;The people of Riverdale have spoken, and
        I respect their decision,&quot; Alvarez said. Whitfield is expected to address supporters
        within the hour.
      </LiveBlogEntry>,
      <LiveBlogEntry
        key="margin"
        timestamp="2026-06-30T23:48:00Z"
        title="Whitfield's lead grows to nearly 4,000 votes as final precincts report"
      >
        With 96% of precincts now reporting, challenger Dana Whitfield holds a lead of roughly
        3,900 votes over incumbent Mayor Carla Alvarez — a margin county election officials say
        is unlikely to be overcome by the remaining outstanding ballots.
      </LiveBlogEntry>,
      <LiveBlogEntry
        key="correction"
        timestamp="2026-06-30T23:20:00Z"
        title="Correction: turnout figure revised down"
        label="update"
      >
        An earlier update in this blog cited turnout of 61%; the county clerk&apos;s office has
        since corrected that figure to 57%, after a reporting error in two east-side precincts.
      </LiveBlogEntry>,
      <LiveBlogEntry
        key="analysis"
        timestamp="2026-06-30T22:55:00Z"
        title="What a Whitfield win would mean for the city's transit overhaul"
      >
        Whitfield has campaigned heavily on completing the long-delayed Riverside light-rail
        extension. Should her narrow lead hold, expect an early push to bring the stalled
        funding vote back before the city council within her first 100 days.
      </LiveBlogEntry>,
      <LiveBlogEntry
        key="opening"
        timestamp="2026-06-30T21:05:00Z"
        title="Polls close, first results expected within the hour"
      >
        Voting has closed across all of Riverdale&apos;s 42 precincts. Election officials say
        early returns from mail-in ballots should be available shortly, with in-person results
        to follow through the evening.
      </LiveBlogEntry>,
    ],
  },
};

/** The same live blog before any breaking alert has fired — the banner slot is simply omitted. */
export const WithoutBreakingBanner: Story = {
  args: {
    ...Default.args,
    breakingNewsBanner: undefined,
  },
};

/** A feed that has only just started: a single entry, demonstrating the layout doesn't assume a minimum entry count either. */
export const SingleEntry: Story = {
  args: {
    ...Default.args,
    breakingNewsBanner: undefined,
    feedStatus: (
      <>
        <span className="font-medium text-text-primary">1 update</span>
        <span aria-hidden="true">·</span>
        <span>Last updated 9:05pm</span>
      </>
    ),
    entries: [
      <LiveBlogEntry
        key="opening"
        timestamp="2026-06-30T21:05:00Z"
        title="Polls close, first results expected within the hour"
      >
        Voting has closed across all of Riverdale&apos;s 42 precincts.
      </LiveBlogEntry>,
    ],
  },
};

export const DarkMode: Story = {
  args: Default.args,
  globals: { theme: "dark" },
};
