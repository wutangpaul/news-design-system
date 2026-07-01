import type { Meta, StoryObj } from "@storybook/react";
import { GlobalHeader } from "./GlobalHeader";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { Button } from "@/components/Button";

const items: PrimaryNavItem[] = [
  { label: "Home", href: "/", current: true },
  {
    label: "Politics",
    href: "/politics",
    megaMenuColumns: [
      {
        heading: "Coverage",
        links: [
          { label: "Elections", href: "/politics/elections" },
          { label: "Congress", href: "/politics/congress" },
        ],
      },
    ],
  },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

const meta = {
  title: "Patterns/Navigation/Global Header",
  component: GlobalHeader,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    logo: <a href="/">The Daily Ledger</a>,
    primaryNavigation: <PrimaryNavigation items={items} />,
    search: <SearchExperience onSearch={() => undefined} />,
    actions: (
      <Button variant="primary" size="sm">
        Subscribe
      </Button>
    ),
  },
} satisfies Meta<typeof GlobalHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sticky: Story = {
  args: {
    sticky: true,
  },
  decorators: [
    (Story) => (
      <div className="h-[200vh]">
        <Story />
        <p className="p-6 text-body text-text-secondary">
          Scroll down — the header stays pinned to the top of the viewport.
        </p>
      </div>
    ),
  ],
};

export const LogoOnly: Story = {
  args: {
    primaryNavigation: undefined,
    search: undefined,
    actions: undefined,
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
