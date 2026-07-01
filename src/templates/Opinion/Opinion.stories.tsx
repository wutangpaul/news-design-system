import type { Meta, StoryObj } from "@storybook/react-vite";
import { Opinion } from "./Opinion";
import { ArticleHeader } from "@/patterns/ArticleHeader";
import { ArticleBody } from "@/patterns/ArticleBody";
import { Byline } from "@/patterns/Byline";
import { PullQuote } from "@/patterns/PullQuote";
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
      { label: "Opinion", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Newsroom Ethics", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

const relatedColumns: RelatedArticle[] = [
  {
    id: "1",
    href: "#",
    title: "The bike-lane fight was never really about bikes",
    imageSrc: "https://picsum.photos/seed/opinion-related-1/640/360",
    imageAlt: "A protected bike lane running alongside a busy avenue.",
    category: "Opinion",
  },
  {
    id: "2",
    href: "#",
    title: "Congestion pricing's biggest problem is that it's honest",
    imageSrc: "https://picsum.photos/seed/opinion-related-2/640/360",
    imageAlt: "Traffic backed up at a bridge toll plaza.",
    category: "Opinion",
  },
];

const comments: CommentData[] = [
  {
    id: "c1",
    author: { name: "Ray Ontiveros" },
    timestamp: "2026-06-29T10:02:00Z",
    body: "Disagree with almost every paragraph of this and I'm still glad it ran — most op-eds on this topic don't even engage with the equity argument, this one at least tries.",
  },
  {
    id: "c2",
    author: { name: "Fatima Siddiqui", avatarSrc: "https://i.pravatar.cc/150?img=25" },
    timestamp: "2026-06-29T11:41:00Z",
    body: "The comparison to Stockholm's rollout is doing a lot of work here. Would like a follow-up that actually digs into how different the transit alternatives are.",
  },
];

const meta = {
  title: "Templates/Opinion",
  component: Opinion,
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
} satisfies Meta<typeof Opinion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "Opinion",
    articleHeader: (
      <ArticleHeader
        title="Congestion Pricing Is Working. That's Exactly Why People Hate It."
        standfirst="Six months in, traffic is down, transit ridership is up, and the sky has not fallen. The backlash was never really about the data."
        byline={
          <div className="flex flex-wrap items-center gap-3">
            <Byline
              authors={[
                {
                  name: "Thomas Okonjo",
                  href: "#",
                  avatarSrc: "https://i.pravatar.cc/150?img=68",
                },
              ]}
              publishedAt="2026-06-29T07:00:00Z"
            />
            <ReadingTime wordCount={820} />
          </div>
        }
      />
    ),
    authorCard: (
      <AuthorCard
        name="Thomas Okonjo"
        avatarSrc="https://i.pravatar.cc/150?img=68"
        title="Contributing Columnist, Urban Policy"
        bio="Thomas writes twice weekly on transportation and urban policy. He was previously a senior advisor at a metropolitan transit authority."
        href="#"
        socialLinks={[
          { label: "Email", href: "mailto:thomas.okonjo@example.com", external: false },
          { label: "Twitter", href: "#" },
        ]}
      />
    ),
    body: (
      <ArticleBody>
        <p>
          Six months ago, this column predicted that congestion pricing would survive its first
          winter mostly intact, and that the loudest objections to it would age badly. Both of
          those predictions have held up better than I expected, which is not something I get to
          say often.
        </p>
        <p>
          Average travel speeds in the priced zone are up nearly 15 percent. Bus ridership on the
          dozen routes that cross the cordon is up double digits. And the apocalyptic predictions
          — empty storefronts, gridlocked side streets as drivers reroute, a mass exodus of
          commuters to the suburbs — simply haven&apos;t materialized in the data, six months
          in, no matter how many times critics insist they will next quarter.
        </p>
        <InlineImage
          src="https://picsum.photos/seed/opinion-inline-1/1200/675"
          alt="A nearly empty avenue during what used to be the morning rush hour."
          caption="Seventh Avenue at 8:40 a.m. last Tuesday — a time slot that used to mean gridlock."
          credit="Daily Ledger photo"
        />
        <p>
          None of this means the policy is beyond criticism. The equity concerns raised by
          delivery drivers and shift workers who can&apos;t simply switch to the train are real,
          and the current exemption structure is too blunt an instrument to address them well.
          But that is a design argument, an argument about which knobs to turn and how far — not
          the argument that was actually made against this policy for the two years leading up to
          its launch.
        </p>
        <PullQuote
          quote="The equity concerns are real, and the exemption structure is too blunt to address them well. But that is a design argument, not the argument that was actually made against this policy."
          attribution="Thomas Okonjo"
        />
        <p>
          What was actually made, over and over, was a prediction of collapse — of a policy so
          disconnected from how people actually live that it would have to be repealed within a
          year. Stockholm heard the same prediction in 2006. So did London in 2003. In both
          cities, public support for congestion pricing rose after implementation, not before it
          — once people could compare the promised catastrophe to the actual, much more boring,
          experience of slightly faster commutes and slightly fuller buses.
        </p>
        <p>
          That is probably the least satisfying possible lesson from six months of data: not that
          critics were lying, but that they were describing a hypothetical city that turned out
          not to be this one.
        </p>
      </ArticleBody>
    ),
    socialSharing: (
      <SocialSharing
        url="https://example.com/opinion/congestion-pricing-six-months"
        title="Congestion Pricing Is Working. That's Exactly Why People Hate It."
      />
    ),
    related: <RelatedArticles heading="More from Opinion" articles={relatedColumns} />,
    comments: <Comments comments={comments} onSubmit={() => {}} onReply={() => {}} />,
  },
};

export const WithoutOptionalSlots: Story = {
  args: {
    eyebrow: "Opinion",
    articleHeader: Default.args!.articleHeader,
    authorCard: Default.args!.authorCard,
    body: Default.args!.body,
  },
};

export const CustomEyebrow: Story = {
  args: {
    ...Default.args,
    eyebrow: "Editorial",
  },
};
