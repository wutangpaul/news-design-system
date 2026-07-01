import type { Meta, StoryObj } from "@storybook/react-vite";
import { Video } from "./Video";
import { VideoCards, type VideoCardItem } from "@/patterns/VideoCards";
import { TopicCollections, type TopicCollectionArticle } from "@/patterns/TopicCollections";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { Card } from "@/components/Card";
import { Image } from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Video", href: "/video", current: true },
];

const videos: VideoCardItem[] = [
  {
    id: "v1",
    title: "Inside the negotiating room: how the trade deal came together",
    href: "/video/trade-deal-negotiating-room",
    thumbnailSrc: "https://picsum.photos/seed/video1/640/360",
    thumbnailAlt: "Delegates seated around a conference table.",
    duration: "6:12",
  },
  {
    id: "v2",
    title: "Drone footage: the flood damage across three river towns",
    href: "/video/flood-damage-drone-footage",
    thumbnailSrc: "https://picsum.photos/seed/video2/640/360",
    thumbnailAlt: "Aerial view of flooded riverside streets.",
    duration: "3:45",
  },
  {
    id: "v3",
    title: "What the new tariffs mean for your grocery bill, explained",
    href: "/video/tariffs-grocery-bill-explained",
    thumbnailSrc: "https://picsum.photos/seed/video3/640/360",
    thumbnailAlt: "A shopping cart in a grocery store aisle.",
    duration: "4:58",
  },
  {
    id: "v4",
    title: "One-on-one with the central bank governor",
    href: "/video/central-bank-governor-interview",
    thumbnailSrc: "https://picsum.photos/seed/video4/640/360",
    thumbnailAlt: "A studio interview setup with two chairs.",
    duration: "18:30",
  },
  {
    id: "v5",
    title: "Election night, minute by minute",
    href: "/video/election-night-recap",
    thumbnailSrc: "https://picsum.photos/seed/video5/640/360",
    thumbnailAlt: "A newsroom studio set with results on screen.",
    duration: "9:02",
  },
  {
    id: "v6",
    title: "The shipping container shortage, mapped",
    href: "/video/shipping-container-shortage-mapped",
    thumbnailSrc: "https://picsum.photos/seed/video6/640/360",
    thumbnailAlt: "Stacks of shipping containers at a port.",
    duration: "5:20",
  },
  {
    id: "v7",
    title: "Wildfire recovery, one year later",
    href: "/video/wildfire-recovery-one-year-later",
    thumbnailSrc: "https://picsum.photos/seed/video7/640/360",
    thumbnailAlt: "New growth among burned tree trunks.",
    duration: "7:41",
  },
  {
    id: "v8",
    title: "Inside the vaccine cold-chain supply run",
    href: "/video/vaccine-cold-chain-supply-run",
    thumbnailSrc: "https://picsum.photos/seed/video8/640/360",
    thumbnailAlt: "A refrigerated truck being loaded at a depot.",
    duration: "5:55",
  },
];

const explainerSeries: TopicCollectionArticle[] = [
  {
    id: "s1",
    headline: "Explained: how interest rate decisions actually get made",
    href: "/video/series/explained-interest-rates",
    thumbnailSrc: "https://picsum.photos/seed/series1/640/360",
    thumbnailAlt: "A whiteboard with an interest rate chart.",
    label: "Explained",
  },
  {
    id: "s2",
    headline: "Explained: what a government shutdown actually shuts down",
    href: "/video/series/explained-government-shutdown",
    thumbnailSrc: "https://picsum.photos/seed/series2/640/360",
    thumbnailAlt: "The exterior of a government office building.",
    label: "Explained",
  },
  {
    id: "s3",
    headline: "Explained: the redistricting fight, in three maps",
    href: "/video/series/explained-redistricting",
    thumbnailSrc: "https://picsum.photos/seed/series3/640/360",
    thumbnailAlt: "A map divided into colored voting districts.",
    label: "Explained",
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
        { label: "Video", href: "/video" },
      ],
    },
  ],
  copyrightText: "© 2026 The Daily Ledger. All rights reserved.",
};

const tradeDealFeatured = (
  <a
    href="/video/trade-deal-negotiating-room"
    className="group block focus-visible:outline-none"
  >
    <Card variant="outlined" interactive className="overflow-hidden">
      <Card.Body className="gap-0 p-0 sm:flex-row">
        <div className="relative sm:w-2/3">
          <Image
            src="https://picsum.photos/seed/videofeatured/1280/720"
            alt="Delegates seated around a long conference table mid-negotiation."
            aspectRatio="16/9"
          />
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-950/60 text-ink-0 transition-transform duration-fast group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <Badge size="sm" className="absolute bottom-3 right-3 bg-ink-950/80 text-ink-0">
            6:12
          </Badge>
        </div>
        <div className="flex flex-col gap-3 p-6 sm:w-1/3 sm:justify-center">
          <Badge variant="brand" size="sm" className="w-fit uppercase tracking-wide">
            Featured
          </Badge>
          <Heading level={2} visualSize={3}>
            Inside the negotiating room: how the trade deal came together
          </Heading>
          <Text color="secondary">
            Our correspondents spent three days with negotiators to reconstruct the final
            48 hours before the deal was signed.
          </Text>
        </div>
      </Card.Body>
    </Card>
  </a>
);

const electionNightFeatured = (
  <a href="/video/election-night-recap" className="group block focus-visible:outline-none">
    <Card variant="outlined" interactive className="overflow-hidden">
      <Card.Body className="gap-0 p-0 sm:flex-row">
        <div className="relative sm:w-2/3">
          <Image
            src="https://picsum.photos/seed/videofeatured2/1280/720"
            alt="A newsroom studio set with election results displayed on screen."
            aspectRatio="16/9"
          />
          <Badge size="sm" className="absolute bottom-3 right-3 bg-ink-950/80 text-ink-0">
            9:02
          </Badge>
        </div>
        <div className="flex flex-col gap-3 p-6 sm:w-1/3 sm:justify-center">
          <Heading level={2} visualSize={3}>
            Election night, minute by minute
          </Heading>
          <Text color="secondary">
            Relive the calls, the surprises, and the concession speeches as they happened.
          </Text>
        </div>
      </Card.Body>
    </Card>
  </a>
);

const meta = {
  title: "Templates/Video",
  component: Video,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    header: headerArgs,
    footer: footerArgs,
    featured: tradeDealFeatured,
    videos: <VideoCards title="Latest videos" videos={videos} />,
    collections: (
      <TopicCollections
        topic="Explained: the video series"
        description="Short, visual breakdowns of the stories behind the headlines."
        articles={explainerSeries}
      />
    ),
  },
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSeries: Story = {
  name: "Without the collections slot",
  args: {
    featured: electionNightFeatured,
    videos: <VideoCards title="More videos" videos={videos.slice(0, 4)} />,
    collections: undefined,
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
