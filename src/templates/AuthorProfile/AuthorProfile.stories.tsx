import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthorProfile } from "./AuthorProfile";
import type { GlobalHeaderProps } from "@/patterns/GlobalHeader";
import type { FooterProps } from "@/patterns/Footer";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { AuthorCard } from "@/patterns/AuthorCard";
import { FeaturedStoryGrid, type FeaturedStoryGridItem } from "@/patterns/FeaturedStoryGrid";
import { StoryCard } from "@/patterns/StoryCard";
import { Button } from "@/components/Button";
import { Pagination } from "@/components/Pagination";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics", current: true },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

// GlobalHeader/Footer content lives here, in the story, not in the template — the template
// only ever composes `<GlobalHeader {...header} />` / `<Footer {...footer} />` directly.
const header: GlobalHeaderProps = {
  logo: <a href="/">The Daily Ledger</a>,
  primaryNavigation: <PrimaryNavigation items={navItems} />,
  search: <SearchExperience onSearch={() => undefined} />,
  actions: (
    <Button variant="primary" size="sm">
      Subscribe
    </Button>
  ),
};

const footer: FooterProps = {
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
  ],
  copyrightText: "© 2026 The Daily Ledger. All rights reserved.",
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const janeStories: FeaturedStoryGridItem[] = [
  {
    headline: "City council approves new transit budget",
    href: "https://example.com/story/transit-budget",
    dek: "The $2.4 billion plan funds four new light-rail lines over the next decade, with construction beginning next spring.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/transit/1200/675",
    imageAlt: "A light-rail train pulling into a downtown station",
    byline: "By Jane Doe",
    timestamp: "3 hours ago",
    featured: true,
  },
  {
    headline: "State legislature reconvenes to debate housing reform",
    href: "https://example.com/story/housing-reform",
    dek: "Lawmakers return to the capitol next week with a packed agenda led by a contested zoning overhaul.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/statehouse/800/600",
    imageAlt: "The steps of a state capitol building",
    byline: "By Jane Doe",
    timestamp: "Yesterday",
  },
  {
    headline: "Mayor unveils plan to overhaul permit approvals",
    href: "https://example.com/story/permit-overhaul",
    dek: "The proposal would cut average approval time from eleven weeks to under three.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/citypermit/800/600",
    imageAlt: "A city hall office window",
    byline: "By Jane Doe",
    timestamp: "2 days ago",
  },
  {
    headline: "Analysis: What the special election turnout really tells us",
    href: "https://example.com/story/special-election-analysis",
    dek: "Turnout in the district's special election broke a decade-long slump, but not evenly across precincts.",
    category: "Politics",
    byline: "By Jane Doe",
    timestamp: "4 days ago",
  },
  {
    headline: "County budget hearing draws record public comment",
    href: "https://example.com/story/county-budget-hearing",
    dek: "Nearly 200 residents signed up to speak, the most in the hearing's twenty-year history.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/hearing/800/600",
    imageAlt: "Rows of seats in a public hearing chamber",
    byline: "By Jane Doe",
    timestamp: "1 week ago",
  },
  {
    headline: "Explainer: How the new redistricting map was drawn",
    href: "https://example.com/story/redistricting-explainer",
    dek: "A walk through the commission's public process, precinct by precinct.",
    category: "Politics",
    byline: "By Jane Doe",
    timestamp: "1 week ago",
  },
];

const meta = {
  title: "Templates/Author Profile",
  component: AuthorProfile,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    header,
    footer,
  },
} satisfies Meta<typeof AuthorProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    authorIntro: (
      <AuthorCard
        headingLevel={1}
        name="Jane Doe"
        avatarSrc="https://i.pravatar.cc/300?u=jane-doe"
        title="Politics Reporter"
        bio="Jane covers city hall and state politics for The Daily Ledger. She previously spent a decade reporting from the statehouse before joining the newsroom, and her work has focused on how local budget decisions ripple through the communities that rely on them."
        href="/authors/jane-doe"
        socialLinks={[
          { label: "Twitter", href: "https://twitter.com/janedoe" },
          { label: "Email", href: "mailto:jane.doe@example.com", external: false },
        ]}
      />
    ),
    storyList: <FeaturedStoryGrid stories={janeStories} headingLevel={3} />,
    pagination: <Pagination page={2} pageCount={9} onPageChange={() => undefined} />,
  },
};

export const NewContributorFewStories: Story = {
  name: "New contributor — few stories, no bio yet",
  args: {
    authorIntro: (
      <AuthorCard
        headingLevel={1}
        name="Sam Lee"
        title="Contributing Writer"
        href="/authors/sam-lee"
      />
    ),
    // A short archive doesn't need FeaturedStoryGrid's magazine layout — a plain vertical
    // list of horizontal StoryCards works just as well, demonstrating that this slot has no
    // fixed shape.
    storyList: (
      <>
        <StoryCard
          layout="horizontal"
          headingLevel={3}
          story={{
            headline: "Local bakery wins national pastry award",
            href: "https://example.com/story/bakery-award",
            dek: "A third-generation family business took home the top prize at this year's ceremony.",
            category: "Food",
            imageSrc: "https://picsum.photos/seed/bakery/400/400",
            imageAlt: "Fresh pastries arranged in a bakery display case",
            byline: "By Sam Lee",
            timestamp: "5 hours ago",
          }}
        />
        <StoryCard
          layout="horizontal"
          headingLevel={3}
          story={{
            headline: "Weekend farmers market moves to a new location",
            href: "https://example.com/story/farmers-market-move",
            category: "Community",
            byline: "By Sam Lee",
            timestamp: "3 days ago",
          }}
        />
      </>
    ),
    // No pagination slot at all — two stories don't warrant it.
  },
};

export const DarkMode: Story = {
  ...Default,
  globals: { theme: "dark" },
};
