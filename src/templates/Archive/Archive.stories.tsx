import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Archive } from "./Archive";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { FeaturedStoryGrid, type FeaturedStoryGridItem } from "@/patterns/FeaturedStoryGrid";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Pagination } from "@/components/Pagination";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics", current: true },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

const header = {
  logo: <a href="/">The Daily Ledger</a>,
  primaryNavigation: <PrimaryNavigation items={navItems} />,
  search: <SearchExperience onSearch={() => undefined} />,
  actions: (
    <Button variant="primary" size="sm">
      Subscribe
    </Button>
  ),
};

const footer = {
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
  copyrightText: "© 2026 The Daily Ledger. All rights reserved.",
};

const sampleStories: FeaturedStoryGridItem[] = [
  {
    headline: "Senate advances infrastructure package after late-night vote",
    dek: "The 68-32 tally sends the bill to conference committee, where lawmakers will reconcile it with the House version.",
    href: "/politics/senate-infrastructure-vote",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/archive-1/800/600",
    byline: "By Maria Chen",
    timestamp: "March 28, 2026",
    timestampDateTime: "2026-03-28",
  },
  {
    headline: "Governors from both parties push back on proposed water-rights overhaul",
    dek: "A bipartisan coalition warns the draft legislation would strip states of local enforcement authority.",
    href: "/politics/governors-water-rights",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/archive-2/800/600",
    byline: "By Daniel Osei",
    timestamp: "March 24, 2026",
    timestampDateTime: "2026-03-24",
  },
  {
    headline: "Redistricting fight heads back to the courts in three states",
    href: "/politics/redistricting-courts",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/archive-3/800/600",
    byline: "By Priya Nair",
    timestamp: "March 19, 2026",
    timestampDateTime: "2026-03-19",
  },
  {
    headline: "Committee subpoenas records in campaign finance inquiry",
    dek: "The request covers fundraising activity going back to the 2024 cycle.",
    href: "/politics/campaign-finance-subpoena",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/archive-4/800/600",
    byline: "By Jordan Blake",
    timestamp: "March 12, 2026",
    timestampDateTime: "2026-03-12",
  },
  {
    headline: "Freshman lawmakers form working group on housing affordability",
    href: "/politics/freshman-housing-group",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/archive-5/800/600",
    byline: "By Maria Chen",
    timestamp: "March 6, 2026",
    timestampDateTime: "2026-03-06",
  },
  {
    headline: "White House signals openness to revised drug-pricing proposal",
    href: "/politics/drug-pricing-proposal",
    category: "Politics",
    imageSrc: "https://picsum.photos/seed/archive-6/800/600",
    byline: "By Daniel Osei",
    timestamp: "March 2, 2026",
    timestampDateTime: "2026-03-02",
  },
];

/**
 * Stand-in for a real date-range/filter control — a page-specific concern outside this
 * design system's current component set. Demonstrates the shape of what typically fills
 * Archive's `filters` slot using existing `Input`/`Button` primitives.
 */
function SampleDateRangeFilters() {
  return (
    <form
      className="flex flex-wrap items-end gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <Input label="From" type="date" defaultValue="2026-03-01" />
      <Input label="To" type="date" defaultValue="2026-03-31" />
      <Button type="submit" variant="secondary" size="md">
        Apply
      </Button>
    </form>
  );
}

const meta = {
  title: "Templates/Archive",
  component: Archive,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    header,
    footer,
    title: "Politics — March 2026",
    description: "All Politics coverage published between March 1 and March 31, 2026.",
  },
} satisfies Meta<typeof Archive>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginatedListing() {
  const [page, setPage] = useState(1);
  return (
    <Archive
      {...meta.args}
      filters={<SampleDateRangeFilters />}
      listing={<FeaturedStoryGrid stories={sampleStories} />}
      pagination={<Pagination page={page} pageCount={6} onPageChange={setPage} />}
    />
  );
}

export const Default: Story = {
  render: () => <PaginatedListing />,
};

export const EmptyState: Story = {
  args: {
    title: "Politics — August 2026",
    description: "All Politics coverage published between August 1 and August 31, 2026.",
    filters: <SampleDateRangeFilters />,
    isEmpty: true,
  },
};

export const WithoutFilters: Story = {
  args: {
    title: "All Politics coverage since 2020",
    description: undefined,
    listing: <FeaturedStoryGrid stories={sampleStories.slice(0, 3)} />,
  },
};

export const DarkMode: Story = {
  args: {
    listing: <FeaturedStoryGrid stories={sampleStories.slice(0, 3)} />,
  },
  globals: { theme: "dark" },
};
