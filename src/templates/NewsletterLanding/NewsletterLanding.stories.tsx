import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsletterLanding } from "./NewsletterLanding";
import { NewsletterSignup } from "@/patterns/NewsletterSignup";
import { PrimaryNavigation, type PrimaryNavItem } from "@/patterns/PrimaryNavigation";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";

const navItems: PrimaryNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Newsletters", href: "/newsletters", current: true },
];

const headerArgs = {
  logo: <a href="/">The Daily Ledger</a>,
  primaryNavigation: <PrimaryNavigation items={navItems} />,
};

const footerArgs = {
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
      heading: "More",
      links: [
        { label: "Newsletters", href: "/newsletters" },
        { label: "RSS", href: "/rss", external: true },
      ],
    },
  ],
  copyrightText: "© 2026 The Daily Ledger. All rights reserved.",
};

const weeklyLedgerIntro = (
  <div className="flex flex-col items-center gap-4">
    <Badge variant="brand" size="sm" className="uppercase tracking-wide">
      Weekly newsletter
    </Badge>
    <Heading level={1} visualSize={2}>
      The Weekly Ledger
    </Heading>
    <Text size="lead" color="secondary">
      Our editors&apos; take on the seven stories that mattered most this week — every
      Friday morning, before your coffee&apos;s gone cold.
    </Text>
  </div>
);

const weeklyLedgerSignup = (
  <NewsletterSignup
    heading="Get The Weekly Ledger"
    description="Free, every Friday. Unsubscribe anytime."
    submitLabel="Subscribe"
    onSubmit={() => {
      // Real usage wires this to an actual subscription request — this pattern only
      // knows how to call the callback.
    }}
  />
);

const weeklyLedgerSampleIssues = (
  <div className="flex flex-col gap-4">
    <Heading level={2} visualSize={5} className="text-center">
      What you&apos;ll get
    </Heading>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card variant="outlined">
        <Card.Body>
          <Text weight="semibold">The week, distilled</Text>
          <Text size="small" color="secondary">
            A tight rundown of the stories our newsroom spent the most time on.
          </Text>
        </Card.Body>
      </Card>
      <Card variant="outlined">
        <Card.Body>
          <Text weight="semibold">One sharp read</Text>
          <Text size="small" color="secondary">
            A single longer piece worth your Saturday morning coffee.
          </Text>
        </Card.Body>
      </Card>
      <Card variant="outlined">
        <Card.Body>
          <Text weight="semibold">Reader mailbag</Text>
          <Text size="small" color="secondary">
            Our editors answer a question from a subscriber each week.
          </Text>
        </Card.Body>
      </Card>
    </div>
  </div>
);

const meta = {
  title: "Templates/Newsletter Landing",
  component: NewsletterLanding,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    header: headerArgs,
    footer: footerArgs,
    intro: weeklyLedgerIntro,
    signup: weeklyLedgerSignup,
    sampleIssues: weeklyLedgerSampleIssues,
  },
} satisfies Meta<typeof NewsletterLanding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSampleIssues: Story = {
  name: "Without the sample-issues slot",
  args: {
    intro: (
      <div className="flex flex-col items-center gap-4">
        <Badge variant="brand" size="sm" className="uppercase tracking-wide">
          Daily newsletter
        </Badge>
        <Heading level={1} visualSize={2}>
          Morning Briefing
        </Heading>
        <Text size="lead" color="secondary">
          The five headlines you need before 7am — every weekday, straight to your inbox.
        </Text>
      </div>
    ),
    signup: (
      <NewsletterSignup
        heading="Get the Morning Briefing"
        description="Free, every weekday morning."
        submitLabel="Subscribe"
        onSubmit={() => {}}
      />
    ),
    sampleIssues: undefined,
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
