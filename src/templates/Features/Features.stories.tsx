import type { Meta, StoryObj } from "@storybook/react-vite";
import { Features } from "./Features";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { HeroStory } from "@/patterns/HeroStory";
import { ArticleBody } from "@/patterns/ArticleBody";
import { ImageGallery } from "@/patterns/ImageGallery";
import { InlineImage } from "@/patterns/InlineImage";
import { PullQuote } from "@/patterns/PullQuote";
import { Byline } from "@/patterns/Byline";
import { SocialSharing } from "@/patterns/SocialSharing";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Share, Bookmark, ExternalLink } from "@/components/Icon";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "World", href: "/world" },
  { label: "Investigations", href: "/investigations", current: true },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

const meta = {
  title: "Templates/Features",
  component: Features,
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
    },
    footer: {
      logo: "The Daily Ledger",
      groups: [
        {
          heading: "Sections",
          links: [
            { label: "World", href: "/world" },
            { label: "Investigations", href: "/investigations" },
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
  },
} satisfies Meta<typeof Features>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A realistic long-form investigative feature: a full-bleed `HeroStory` hero, an
 * `ArticleBody` mixing paragraphs, headings, a `PullQuote`, a multi-image `ImageGallery`,
 * an inset `InlineImage`, and a second `PullQuote`, followed by `SocialSharing`.
 */
export const Default: Story = {
  args: {
    hero: (
      <HeroStory
        category="Investigations"
        title="The Vanishing Wetlands: Inside the Fight to Save the Delta"
        dek="Over three decades, half of the region's tidal marsh has disappeared. Reporters spent a year tracing the money, the maps, and the families caught in between."
        imageSrc="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=80"
        imageAlt="Aerial view of a winding river delta cutting through green wetlands"
        aspectRatio="21/9"
        headingLevel={1}
      />
    ),
    body: (
      <ArticleBody>
        <Byline
          authors={[
            { name: "Renata Okafor", href: "/authors/renata-okafor" },
            { name: "Tomás Villanueva", href: "/authors/tomas-villanueva" },
          ]}
          publishedAt="2026-06-15T08:00:00Z"
          updatedAt="2026-06-30T10:30:00Z"
        />
        <Text as="p" size="lead">
          The first thing you notice, flying over the delta at dawn, is how much open water
          there is where the survey maps still show green. Fifty years ago, this was solid
          marsh from the ridge to the bay. Today, entire townships exist only as names on a
          chart, the land beneath them having quietly returned to the tide.
        </Text>
        <Text as="p">
          Interviews with more than sixty residents, engineers, and state officials, along
          with an analysis of thirty years of satellite imagery, show a pattern of delayed
          maintenance, diverted flood-control funds, and repeatedly missed restoration
          deadlines — even as the agency responsible continued to tell state lawmakers the
          wetlands were &quot;stable.&quot;
        </Text>
        <Heading level={2}>A slow-motion disappearance</Heading>
        <Text as="p">
          Satellite data reviewed for this story shows the marsh retreating at an average of
          nearly 40 acres a year since 1995 — an area roughly the size of thirty football
          fields disappearing beneath open water annually, mostly unnoticed because it happens
          gradually, one storm surge at a time.
        </Text>
        <ImageGallery
          label="Satellite comparisons of the delta marshland, 1995 to 2025"
          images={[
            {
              src: "https://picsum.photos/seed/delta-1995/1200/675",
              alt: "Satellite image of the delta marshland in 1995, showing dense green wetland",
              caption: "The delta in 1995, before the worst of the retreat began.",
              credit: "State Coastal Survey",
            },
            {
              src: "https://picsum.photos/seed/delta-2010/1200/675",
              alt: "Satellite image of the delta marshland in 2010, showing visible fragmentation",
              caption: "By 2010, open-water gaps had begun fragmenting the marsh interior.",
              credit: "State Coastal Survey",
            },
            {
              src: "https://picsum.photos/seed/delta-2025/1200/675",
              alt: "Satellite image of the delta marshland in 2025, showing extensive open water",
              caption: "The same stretch in 2025 — roughly half the marsh cover is gone.",
              credit: "State Coastal Survey",
            },
          ]}
        />
        <PullQuote
          quote="We kept filing the same report every year: stable, stable, stable. Nobody upstairs wanted the other word."
          attribution="Former state wetlands biologist, speaking on condition of anonymity"
        />
        <Text as="p">
          Agency emails obtained through a public-records request show staff raised concerns
          about erosion rates as early as 2011, four years before the first public acknowledgment
          of a &quot;measurable decline.&quot;
        </Text>
        <Heading level={2}>Living with the tide</Heading>
        <Text as="p">
          For families in the low-lying township of Grayson&apos;s Point, the abstraction of acreage
          statistics is a daily, physical fact: the water now reaches the porch steps during
          the highest tides of the year, something longtime residents say never happened before
          the mid-2000s.
        </Text>
        <InlineImage
          align="inset-right"
          src="https://picsum.photos/seed/graysons-point/800/1000"
          alt="An elevated wooden house surrounded by shallow floodwater at high tide"
          caption="A home in Grayson's Point during a September high tide."
          credit="Renata Okafor for The Daily Ledger"
        />
        <Text as="p">
          &quot;We used to garden right up to that fence line,&quot; said resident Dolores Fenn,
          pointing to a stretch of water where a vegetable patch once stood. &quot;Now
          it&apos;s just where the bay starts.&quot;
        </Text>
        <Text as="p">
          State officials say a $220 million restoration plan, approved in principle three
          years ago, remains unfunded pending a legislative vote expected later this year.
        </Text>
        <PullQuote
          quote="This isn't a maintenance problem anymore. It's a question of what we're willing to let go of."
          attribution="Dr. Naomi Petrossian, wetlands ecologist"
          align="center"
        />
      </ArticleBody>
    ),
    socialSharing: (
      <SocialSharing
        url="https://example.com/investigations/vanishing-wetlands"
        title="The Vanishing Wetlands: Inside the Fight to Save the Delta"
      />
    ),
  },
};

export const DarkMode: Story = {
  args: Default.args,
  globals: { theme: "dark" },
};
