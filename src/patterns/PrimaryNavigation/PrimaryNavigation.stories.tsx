import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimaryNavigation, type PrimaryNavItem } from "./PrimaryNavigation";

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
          { label: "White House", href: "/politics/white-house" },
        ],
      },
      {
        heading: "States",
        links: [
          { label: "State Policy", href: "/politics/states/policy" },
          { label: "Governors", href: "/politics/states/governors" },
        ],
      },
    ],
    megaMenuFeatured: {
      eyebrow: "Featured",
      label: "Inside the final days of the campaign",
      href: "/politics/features/final-days",
    },
  },
  {
    label: "World",
    href: "/world",
    megaMenuColumns: [
      {
        heading: "Regions",
        links: [
          { label: "Africa", href: "/world/africa" },
          { label: "Americas", href: "/world/americas" },
          { label: "Asia", href: "/world/asia" },
        ],
      },
    ],
  },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
  { label: "Opinion", href: "/opinion" },
];

const meta = {
  title: "Patterns/Navigation/Primary Navigation",
  component: PrimaryNavigation,
  parameters: {
    layout: "padded",
  },
  args: {
    items,
  },
} satisfies Meta<typeof PrimaryNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoMegaMenus: Story = {
  args: {
    items: items.map(({ label, href, current }) => ({ label, href, current })),
  },
};

export const MobileToggle: Story = {
  name: "Mobile toggle (narrow viewport)",
  parameters: {
    // "mobile1" is one of addon-essentials' built-in viewport presets (no custom
    // .storybook/main.ts config needed) — narrow enough that the `lg:` breakpoint
    // collapses the desktop list and shows the Drawer-based toggle button instead.
    viewport: { defaultViewport: "mobile1" },
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
