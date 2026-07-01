import type { Meta, StoryObj } from "@storybook/react-vite";
import { Article } from "./Article";
import { ArticleHeader } from "@/patterns/ArticleHeader";
import { ArticleBody } from "@/patterns/ArticleBody";
import { Byline } from "@/patterns/Byline";
import { PullQuote } from "@/patterns/PullQuote";
import { BlockQuote } from "@/patterns/BlockQuote";
import { InlineImage } from "@/patterns/InlineImage";
import { SocialSharing } from "@/patterns/SocialSharing";
import { AuthorCard } from "@/patterns/AuthorCard";
import { RelatedArticles, type RelatedArticle } from "@/patterns/RelatedArticles";
import { Comments, type CommentData } from "@/patterns/Comments";
import { ReadingTime } from "@/patterns/ReadingTime";

const footerGroups = [
  {
    heading: "Sections",
    links: [
      { label: "World", href: "#" },
      { label: "Business", href: "#" },
      { label: "Climate", href: "#" },
      { label: "Opinion", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Newsroom Ethics", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const relatedArticles: RelatedArticle[] = [
  {
    id: "1",
    href: "#",
    title: "Three states quietly rewrote their heat-emergency playbooks this spring",
    imageSrc: "https://picsum.photos/seed/grid-related-1/640/360",
    imageAlt: "Utility workers inspecting a substation transformer.",
    category: "Climate",
  },
  {
    id: "2",
    href: "#",
    title: "The battery farms racing to replace peaker plants",
    imageSrc: "https://picsum.photos/seed/grid-related-2/640/360",
    imageAlt: "Rows of grid-scale battery storage containers.",
    category: "Energy",
  },
  {
    id: "3",
    href: "#",
    title: "Why your utility bill keeps rising even as usage falls",
    imageSrc: "https://picsum.photos/seed/grid-related-3/640/360",
    imageAlt: "A hand holding a utility bill next to a laptop.",
    category: "Business",
  },
];

const comments: CommentData[] = [
  {
    id: "c1",
    author: { name: "Marcus Feld", avatarSrc: "https://i.pravatar.cc/150?img=12" },
    timestamp: "2026-06-28T14:32:00Z",
    body: "Lived through the '21 outages here — the transformer replacement schedule they're describing is not moving fast enough for what's coming this July.",
    replies: [
      {
        id: "c1-r1",
        author: { name: "Elena Vasquez", avatarSrc: "https://i.pravatar.cc/150?img=47" },
        timestamp: "2026-06-28T15:05:00Z",
        body: "Reporter here — that's exactly what two of the engineers I spoke with said off the record. Following up on the replacement timeline for a future piece.",
      },
    ],
  },
  {
    id: "c2",
    author: { name: "Priya Nair" },
    timestamp: "2026-06-28T16:10:00Z",
    body: "Would love to see the actual capital spending numbers broken out by state rather than the national total — hard to tell who's actually behind.",
  },
  {
    id: "c3",
    author: { name: "Doug Whitfield", avatarSrc: "https://i.pravatar.cc/150?img=33" },
    timestamp: "2026-06-29T08:47:00Z",
    body: "Solid piece. Wish it had gone further into the interconnection queue backlog, but I understand that's a whole separate article.",
  },
];

const meta = {
  title: "Templates/Article",
  component: Article,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    header: {
      logo: <span>The Daily Ledger</span>,
      sticky: true,
    },
    footer: {
      logo: <span>The Daily Ledger</span>,
      groups: footerGroups,
      copyrightText: "© 2026 The Daily Ledger. All rights reserved.",
      legalLinks: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  },
} satisfies Meta<typeof Article>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    articleHeader: (
      <ArticleHeader
        title="Inside the Multi-Billion-Dollar Race to Rebuild the Grid Before Summer Peak Hits"
        standfirst="As heat waves grow more frequent and severe, utilities across the country are racing against the clock — and against each other — to harden a power grid built for a different climate."
        byline={
          <div className="flex flex-wrap items-center gap-3">
            <Byline
              authors={[
                {
                  name: "Elena Vasquez",
                  href: "#",
                  avatarSrc: "https://i.pravatar.cc/150?img=47",
                },
              ]}
              publishedAt="2026-06-28T09:00:00Z"
              updatedAt="2026-06-29T11:15:00Z"
            />
            <ReadingTime wordCount={1150} />
          </div>
        }
      />
    ),
    body: (
      <ArticleBody>
        <p>
          The transformer sitting behind a chain-link fence off Route 9 doesn&apos;t look like
          much — a rust-streaked steel box the size of a delivery van, humming quietly in the
          summer heat. But when it failed during a heat dome two Julys ago, it took down power to
          40,000 homes for the better part of a week. Its replacement, installed last month, is
          part of a build-out utilities say is now the largest sustained capital investment in
          the American grid since the 1960s.
        </p>
        <p>
          Across the country, utilities have committed more than $110 billion over the next five
          years to substation upgrades, transformer replacements, and new transmission capacity —
          a figure that has roughly doubled since 2021. The driver isn&apos;t just aging
          infrastructure. It&apos;s a climate that is producing longer, hotter, and more frequent
          heat waves than the grid was ever designed to withstand, layered on top of a surge in
          demand from data centers and electric vehicles that nobody was modeling for a decade
          ago.
        </p>
        <InlineImage
          src="https://picsum.photos/seed/grid-inline-1/1200/675"
          alt="A utility crew working on a high-voltage transmission tower against a hazy summer sky."
          caption="A crew replaces insulators on a transmission tower outside Springfield ahead of this year's cooling season."
          credit="Daily Ledger photo / Marcus Feld"
        />
        <p>
          &ldquo;We used to plan for a hundred-year storm,&rdquo; said Renata Cole, a grid
          reliability engineer who has spent 22 years at one of the utilities leading the
          build-out. &ldquo;Now we&apos;re planning for a climate that didn&apos;t really exist
          when most of this equipment was installed. The margin for error is gone.&rdquo;
        </p>
        <PullQuote
          quote="We used to plan for a hundred-year storm. Now we're planning for a climate that didn't really exist when most of this equipment was installed."
          attribution="Renata Cole, grid reliability engineer"
        />
        <p>
          Not everyone is convinced the spending is being directed where it will matter most.
          Consumer advocates argue that some of the largest line items — new substations sited
          near data center campuses — are being subsidized by residential ratepayers whose bills
          have climbed by double digits over the past three years, even as their own household
          usage has stayed flat or declined.
        </p>
        <BlockQuote
          quote="Ratepayers are footing the bill for a build-out that is substantially about serving new commercial load, not keeping the lights on in people's homes during a heat wave. Those are related problems, but they are not the same problem, and the difference matters for who pays."
          attribution="Denise Okafor, state utility consumer advocate"
        />
        <p>
          Utilities counter that the two problems are, in practice, inseparable: hardening
          substations for data center demand also means more redundancy and faster failover for
          the neighborhoods those substations happen to serve. Whether that argument holds up
          will likely be tested this summer, as forecasters predict at least three multi-day heat
          waves across the region before Labor Day — the first real stress test for a grid still,
          in places, only half-rebuilt.
        </p>
      </ArticleBody>
    ),
    socialSharing: <SocialSharing url="https://example.com/articles/grid-rebuild-race" title="Inside the Multi-Billion-Dollar Race to Rebuild the Grid Before Summer Peak Hits" />,
    related: (
      <>
        <AuthorCard
          name="Elena Vasquez"
          avatarSrc="https://i.pravatar.cc/150?img=47"
          title="Energy & Climate Reporter"
          bio="Elena covers the energy transition and grid infrastructure. She previously spent six years reporting on utility regulation for a regional business desk."
          href="#"
          socialLinks={[
            { label: "Email", href: "mailto:elena.vasquez@example.com", external: false },
            { label: "Twitter", href: "#" },
          ]}
        />
        <RelatedArticles articles={relatedArticles} />
      </>
    ),
    comments: <Comments comments={comments} onSubmit={() => {}} onReply={() => {}} />,
  },
};

export const WithoutOptionalSlots: Story = {
  args: {
    articleHeader: Default.args!.articleHeader,
    body: Default.args!.body,
  },
};
