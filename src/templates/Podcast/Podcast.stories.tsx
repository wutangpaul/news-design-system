import type { Meta, StoryObj } from "@storybook/react-vite";
import { Podcast } from "./Podcast";
import { PodcastCards, type PodcastCardItem } from "@/patterns/PodcastCards";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { Image } from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Podcasts", href: "/podcasts", current: true },
];

const episodes: PodcastCardItem[] = [
  {
    id: "e1",
    show: "The Daily Ledger Briefing",
    title: "Ep. 214: What the jobs report actually tells us",
    href: "/podcasts/daily-ledger-briefing/214",
    duration: "28:14",
    artworkSrc: "https://picsum.photos/seed/podcast1/200/200",
    artworkAlt: "The Daily Ledger Briefing show artwork.",
  },
  {
    id: "e2",
    show: "The Daily Ledger Briefing",
    title: "Ep. 213: Inside the closed-door budget talks",
    href: "/podcasts/daily-ledger-briefing/213",
    duration: "34:02",
    artworkSrc: "https://picsum.photos/seed/podcast1/200/200",
    artworkAlt: "The Daily Ledger Briefing show artwork.",
  },
  {
    id: "e3",
    show: "The Daily Ledger Briefing",
    title: "Ep. 212: A conversation with the outgoing central bank governor",
    href: "/podcasts/daily-ledger-briefing/212",
    duration: "41:37",
    artworkSrc: "https://picsum.photos/seed/podcast1/200/200",
    artworkAlt: "The Daily Ledger Briefing show artwork.",
  },
  {
    id: "e4",
    show: "The Daily Ledger Briefing",
    title: "Ep. 211: The redistricting fight, explained",
    href: "/podcasts/daily-ledger-briefing/211",
    duration: "25:49",
    artworkSrc: "https://picsum.photos/seed/podcast1/200/200",
    artworkAlt: "The Daily Ledger Briefing show artwork.",
  },
  {
    id: "e5",
    show: "The Daily Ledger Briefing",
    title: "Ep. 210: Three years into the port slowdown",
    href: "/podcasts/daily-ledger-briefing/210",
    duration: "31:58",
  },
  {
    id: "e6",
    show: "The Daily Ledger Briefing",
    title: "Ep. 209: What we got wrong about the recovery",
    href: "/podcasts/daily-ledger-briefing/209",
    duration: "29:20",
  },
];

const headerArgs = {
  logo: <a href="/">The Daily Ledger</a>,
  primaryNavigation: <PrimaryNavigation items={navItems} />,
};

const footerArgs = {
  logo: "The Daily Ledger",
  groups: [
    {
      heading: "Sections",
      links: [
        { label: "World", href: "/world" },
        { label: "Politics", href: "/politics" },
        { label: "Podcasts", href: "/podcasts" },
      ],
    },
  ],
  copyrightText: "© 2026 The Daily Ledger. All rights reserved.",
};

const dailyLedgerBriefingShowIntro = (
  <div className="flex flex-col gap-4">
    <Image
      src="https://picsum.photos/seed/podcastshow/400/400"
      alt="The Daily Ledger Briefing show artwork."
      aspectRatio="1/1"
      containerClassName="w-40 rounded-lg sm:w-full"
    />
    <Heading level={1} visualSize={3}>
      The Daily Ledger Briefing
    </Heading>
    <Text color="secondary">
      Twenty minutes on the two or three stories that matter most, every weekday morning —
      hosted by our senior political and economics correspondents.
    </Text>
    <div className="flex flex-wrap gap-2">
      <Badge variant="neutral" size="sm">
        Daily
      </Badge>
      <Badge variant="neutral" size="sm">
        News
      </Badge>
    </div>
  </div>
);

const meta = {
  title: "Templates/Podcast",
  component: Podcast,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    header: headerArgs,
    footer: footerArgs,
    showIntro: dailyLedgerBriefingShowIntro,
    episodes: <PodcastCards title="All episodes" episodes={episodes} />,
  },
} satisfies Meta<typeof Podcast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoArtworkOnOlderEpisodes: Story = {
  name: "Older episodes missing artwork",
  args: {
    episodes: <PodcastCards title="All episodes" episodes={episodes.slice(4)} />,
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
