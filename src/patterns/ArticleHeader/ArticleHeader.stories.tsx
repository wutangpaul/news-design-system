import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { ArticleHeader } from "./ArticleHeader";

const meta = {
  title: "Patterns/Editorial/Article Header",
  component: ArticleHeader,
  args: {
    title: "City council approves record transit budget after marathon session",
  },
} satisfies Meta<typeof ArticleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A stand-in byline node — the real Byline pattern is built separately. */
const SampleByline = () => (
  <div className="flex items-center gap-3">
    <Avatar name="Jordan Reyes" size="sm" />
    <div className="flex flex-col">
      <Text as="span" size="small" weight="medium">
        Jordan Reyes
      </Text>
      <Text as="span" size="caption" color="tertiary">
        June 30, 2026 · 6 min read
      </Text>
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <ArticleHeader
      {...args}
      className="mx-auto max-w-[65ch]"
      title="City council approves record transit budget after marathon session"
      standfirst="The $2.4 billion plan funds four new light-rail lines over the next decade, but critics say the funding mechanism could strain the general fund."
      byline={<SampleByline />}
    />
  ),
};

export const TitleOnly: Story = {
  name: "Title only",
  render: () => (
    <ArticleHeader className="mx-auto max-w-[65ch]" title="Markets rally after central bank signals rate pause" />
  ),
};

export const WithoutByline: Story = {
  name: "Without byline slot",
  render: () => (
    <ArticleHeader
      className="mx-auto max-w-[65ch]"
      title="Regional harvest yields exceed forecasts for third year running"
      standfirst="Favorable weather and new irrigation infrastructure drove gains across three provinces."
    />
  ),
};

export const DarkMode: Story = {
  name: "Dark mode",
  parameters: { globals: { theme: "dark" } },
  render: () => (
    <ArticleHeader
      className="mx-auto max-w-[65ch]"
      title="City council approves record transit budget after marathon session"
      standfirst="The $2.4 billion plan funds four new light-rail lines over the next decade."
      byline={<SampleByline />}
    />
  ),
};
