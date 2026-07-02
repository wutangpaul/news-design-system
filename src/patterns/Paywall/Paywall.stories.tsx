import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@/components/Text";
import { Heading } from "@/components/Heading";
import { Paywall } from "./Paywall";

const ARTICLE_PARAGRAPHS = [
  "The city council voted 7-2 late Tuesday to approve the downtown transit overhaul, ending a three-year debate over how the corridor's aging bus network should be modernized.",
  "Supporters of the plan, which reallocates two traffic lanes on Fifth Avenue to dedicated bus and bike lanes, say it will cut average commute times by nearly a third once fully implemented in 2027.",
  "Opponents — largely small business owners along the corridor — argued the loss of curbside parking would hurt foot traffic during the multi-year construction window.",
  "The final vote came after an amendment, added just hours before the meeting, that phases in the lane conversion over eighteen months rather than all at once.",
  "Council member Dana Ruiz, who authored the amendment, called it 'a compromise that gets us to the same destination without breaking the businesses that make that street worth visiting in the first place.'",
  "Construction is expected to begin in the second quarter of next year, with the first phase focused on the three-block stretch between Union Square and the transit center.",
];

function SampleArticle() {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={1} visualSize={2}>
        City council approves downtown transit overhaul in 7-2 vote
      </Heading>
      {ARTICLE_PARAGRAPHS.map((paragraph, index) => (
        <Text key={index}>{paragraph}</Text>
      ))}
    </div>
  );
}

const meta = {
  title: "Patterns/Editorial/Paywall",
  component: Paywall,
  parameters: {
    layout: "padded",
  },
  args: {
    // Every story below supplies real content via its own `render`; this placeholder
    // only satisfies `children`'s required-prop typing at the meta level.
    children: null,
    onCtaClick: () => {},
  },
} satisfies Meta<typeof Paywall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unlocked: Story = {
  name: "Unlocked (subscriber)",
  render: () => (
    <div className="mx-auto max-w-2xl">
      <Paywall locked={false}>
        <SampleArticle />
      </Paywall>
    </div>
  ),
};

export const Locked: Story = {
  name: "Locked (soft paywall)",
  render: () => (
    <div className="mx-auto max-w-2xl">
      <Paywall
        locked
        signInHref="#sign-in"
        onCtaClick={() => {
          // Real usage wires this to your subscribe flow (checkout page, modal,
          // router navigation, ...) — this pattern only knows how to call the callback.
        }}
      >
        <SampleArticle />
      </Paywall>
    </div>
  ),
};

export const CustomCopy: Story = {
  name: "Custom heading, description, and CTA copy",
  render: () => (
    <div className="mx-auto max-w-2xl">
      <Paywall
        locked
        heading="You've hit your free article limit"
        description="Subscribers get unlimited articles, the daily briefing newsletter, and full archive access."
        ctaLabel="See subscription plans"
        signInHref="#sign-in"
        signInLabel="Sign in"
        onCtaClick={() => {}}
      >
        <SampleArticle />
      </Paywall>
    </div>
  ),
};

export const Interactive: Story = {
  name: "Interactive (toggle locked state)",
  render: function InteractiveStory() {
    const [locked, setLocked] = useState(true);
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <button
          type="button"
          className="self-start rounded-md border border-surface-border-strong px-3 py-1.5 text-small"
          onClick={() => setLocked((value) => !value)}
        >
          Simulate {locked ? "successful sign-in" : "logging out"}
        </button>
        <Paywall
          locked={locked}
          signInHref="#sign-in"
          onCtaClick={() => setLocked(false)}
        >
          <SampleArticle />
        </Paywall>
      </div>
    );
  },
};
