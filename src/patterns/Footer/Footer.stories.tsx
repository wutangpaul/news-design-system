import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./Footer";
import { Share, Bookmark, ExternalLink } from "@/components/Icon";

const meta = {
  title: "Patterns/Navigation/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  args: {
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
          { label: "Press", href: "/press" },
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
      { label: "Follow us on Facebook", href: "https://facebook.com/example", icon: <Bookmark size="sm" /> },
      { label: "Visit our newsroom site", href: "https://example.com", icon: <ExternalLink size="sm" /> },
    ],
    copyrightText: "© 2026 The Daily Ledger. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Settings", href: "/cookies" },
    ],
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithNewsletterSlot: Story = {
  args: {
    newsletterSlot: (
      <div className="rounded-md border border-surface-border bg-surface-raised p-4">
        <p className="text-small font-semibold text-text-primary">Get our morning briefing</p>
        <p className="mt-1 text-caption text-text-tertiary">
          (Placeholder — the real Newsletter Signup pattern is built separately.)
        </p>
      </div>
    ),
  },
};

export const MinimalNoLegalRow: Story = {
  args: {
    socialLinks: undefined,
    copyrightText: undefined,
    legalLinks: undefined,
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
