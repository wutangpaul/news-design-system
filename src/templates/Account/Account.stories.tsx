import type { Meta, StoryObj } from "@storybook/react-vite";
import { Account } from "./Account";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { SearchExperience } from "@/patterns/SearchExperience";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Share, Bookmark, ExternalLink } from "@/components/Icon";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Culture", href: "/culture" },
];

const meta = {
  title: "Templates/Account",
  component: Account,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Account>;

export default meta;
type Story = StoryObj<typeof meta>;

const sharedChrome = {
  header: {
    logo: <a href="/">The Daily Ledger</a>,
    primaryNavigation: <PrimaryNavigation items={navItems} />,
    search: <SearchExperience onSearch={() => undefined} />,
    actions: (
      <Button variant="secondary" size="sm">
        Account
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
  },
};

export const Default: Story = {
  args: {
    ...sharedChrome,
    name: "Renata Cole",
    email: "renata.cole@example.com",
    plan: {
      planName: "Premium",
      tone: "success",
      detail: "Renews July 15, 2026 — $12.99/month",
    },
    billing: (
      <div className="rounded-lg border border-surface-border bg-surface-raised p-4">
        <Text size="small" color="secondary">
          Visa ending in 4242 — expires 08/2028
        </Text>
      </div>
    ),
    onSignOut: () => {},
  },
};

export const PastDuePlan: Story = {
  name: "Past-due plan (no billing slot)",
  args: {
    ...sharedChrome,
    name: "Marcus Webb",
    email: "marcus.webb@example.com",
    plan: {
      planName: "Digital + Print",
      tone: "warning",
      detail: "Payment failed — update your payment method to avoid a lapse in access",
    },
    onSignOut: () => {},
  },
};
