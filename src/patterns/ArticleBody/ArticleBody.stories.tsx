import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "@/components/Heading";
import { Image } from "@/components/Image";
import { Text } from "@/components/Text";
import { PullQuote } from "@/patterns/PullQuote";
import { BlockQuote } from "@/patterns/BlockQuote";
import { ArticleBody } from "./ArticleBody";

const meta = {
  title: "Patterns/Editorial/Article Body",
  component: ArticleBody,
} satisfies Meta<typeof ArticleBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ArticleBody>
      <Text as="p">
        Engineers say the new barriers should hold, but funding gaps have delayed work
        in three of the six affected counties, raising questions about whether the
        region will be ready before the next storm season.
      </Text>
      <Text as="p">
        The state Coastal Resilience Office estimates that closing the remaining gap
        would cost roughly $80 million, a figure that has drawn criticism from both
        fiscal conservatives and residents who say the pace of construction is already
        too slow.
      </Text>
    </ArticleBody>
  ),
};

export const WithHeadingsAndImage: Story = {
  name: "Headings, images, and pull quotes",
  render: () => (
    <ArticleBody>
      <Text as="p">
        Engineers say the new barriers should hold, but funding gaps have delayed work
        in three of the six affected counties.
      </Text>
      <Image
        src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80"
        alt="Workers reinforcing a concrete sea wall at sunset"
        aspectRatio="16/9"
        className="rounded-md"
      />
      <Heading level={2}>A patchwork of progress</Heading>
      <Text as="p">
        The state Coastal Resilience Office estimates that closing the remaining gap
        would cost roughly $80 million.
      </Text>
      <PullQuote
        quote="We rebuilt everything twice — once for the flood, once for the flood after that."
        attribution="Mara Diallo, town engineer"
      />
      <Text as="p">
        County officials say a supplemental budget request is under review, though it
        is unlikely to reach the floor before the current session ends.
      </Text>
      <Heading level={2}>What residents are saying</Heading>
      <BlockQuote
        quote="We knew the levee wouldn't hold, but we didn't have the budget to say so publicly."
        attribution="Mara Diallo, town engineer"
      />
      <Text as="p">
        She resigned three months later, citing the same funding gap the council is now
        being asked to close.
      </Text>
    </ArticleBody>
  ),
};

export const DarkMode: Story = {
  name: "Dark mode",
  globals: { theme: "dark" },
  render: () => (
    <ArticleBody>
      <Text as="p">
        Engineers say the new barriers should hold, but funding gaps have delayed work
        in three of the six affected counties.
      </Text>
      <PullQuote
        quote="We rebuilt everything twice — once for the flood, once for the flood after that."
        attribution="Mara Diallo, town engineer"
      />
      <Text as="p">
        County officials say a supplemental budget request is under review.
      </Text>
    </ArticleBody>
  ),
};
