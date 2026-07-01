import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchResults } from "./SearchResults";
import type { GlobalHeaderProps } from "@/patterns/GlobalHeader";
import type { FooterProps } from "@/patterns/Footer";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { StoryCard, type StoryCardContent } from "@/patterns/StoryCard";
import { Button } from "@/components/Button";
import { Pagination } from "@/components/Pagination";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

function makeHeader(query: string): GlobalHeaderProps {
  return {
    logo: <a href="/">The Daily Ledger</a>,
    primaryNavigation: <PrimaryNavigation items={navItems} />,
    // The current query stays visible/editable from the results page via SearchExperience's
    // own `defaultValue` — the template never reaches into `header` to set this itself.
    search: <SearchExperience defaultValue={query} onSearch={() => undefined} />,
    actions: (
      <Button variant="primary" size="sm">
        Subscribe
      </Button>
    ),
  };
}

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

const matchingStories: StoryCardContent[] = [
  {
    headline: "City council approves new transit budget",
    href: "https://example.com/story/transit-budget",
    dek: "The $2.4 billion plan funds four new light-rail lines over the next decade, with construction beginning next spring.",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/transit/400/400",
    imageAlt: "A light-rail train pulling into a downtown station",
    byline: "By Jane Doe",
    timestamp: "3 hours ago",
  },
  {
    headline: "Transit agency proposes fare increase to close budget gap",
    href: "https://example.com/story/fare-increase",
    dek: "Riders would see a 15% jump in monthly pass prices starting next year under the draft plan.",
    category: "Business",
    imageSrc: "https://picsum.photos/seed/farebox/400/400",
    imageAlt: "A transit fare card reader",
    byline: "By Alex Rivera",
    timestamp: "1 day ago",
  },
  {
    headline: "Opinion: The transit budget fight was never really about buses",
    href: "https://example.com/story/transit-budget-opinion",
    dek: "Behind the line-item debate is a decades-old argument about who the city center is for.",
    category: "Opinion",
    byline: "By Priya Nair",
    timestamp: "2 days ago",
  },
];

const meta = {
  title: "Templates/Search Results",
  component: SearchResults,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    footer,
  },
} satisfies Meta<typeof SearchResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: makeHeader("transit budget"),
    query: "transit budget",
    resultCount: 127,
    resultsList: (
      <>
        {matchingStories.map((story) => (
          <StoryCard key={story.href} layout="horizontal" headingLevel={2} story={story} />
        ))}
      </>
    ),
    pagination: <Pagination page={2} pageCount={13} onPageChange={() => undefined} />,
  },
};

export const NoResults: Story = {
  name: "Zero results (empty state)",
  args: {
    header: makeHeader("qwzxlbn nonsense query"),
    query: "qwzxlbn nonsense query",
    resultCount: 0,
  },
};

export const DarkMode: Story = {
  ...Default,
  globals: { theme: "dark" },
};
