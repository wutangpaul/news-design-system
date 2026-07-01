import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorPages } from "./ErrorPages";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { Button } from "@/components/Button";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics" },
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

const meta = {
  title: "Templates/Error Pages",
  component: ErrorPages,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    header,
    footer,
  },
} satisfies Meta<typeof ErrorPages>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {
  args: {
    variant: "not-found",
  },
};

export const ServerError: Story = {
  args: {
    variant: "server-error",
  },
};

export const Offline: Story = {
  args: {
    variant: "offline",
  },
};

export const NotFoundWithCustomCopy: Story = {
  args: {
    variant: "not-found",
    heading: "That story has moved",
    description:
      "We recently reorganized our Politics coverage. Try searching for the headline, or browse the section from the homepage.",
  },
};

export const DarkMode: Story = {
  args: {
    variant: "server-error",
  },
  globals: { theme: "dark" },
};
