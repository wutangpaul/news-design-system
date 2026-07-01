import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroStory } from "./HeroStory";

const IMAGE_SRC =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80";

const meta = {
  title: "Patterns/Editorial/Hero Story",
  component: HeroStory,
  args: {
    title: "Coastal cities race to finish sea walls before hurricane season",
    imageSrc: IMAGE_SRC,
    imageAlt: "Workers reinforcing a concrete sea wall at sunset",
  },
} satisfies Meta<typeof HeroStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <HeroStory
      {...args}
      className="max-w-3xl"
      category="Climate"
      title="Coastal cities race to finish sea walls before hurricane season"
      dek="Engineers say the new barriers should hold, but funding gaps have delayed work in three of the six affected counties."
      imageSrc={IMAGE_SRC}
      imageAlt="Workers reinforcing a concrete sea wall at sunset"
    />
  ),
};

export const WithoutCategory: Story = {
  name: "Without category tag",
  render: () => (
    <HeroStory
      className="max-w-3xl"
      title="Markets rally after central bank signals rate pause"
      dek="Investors welcomed the news after months of volatility."
      imageSrc={IMAGE_SRC}
      imageAlt="Traders on a stock exchange floor"
    />
  ),
};

export const TitleOnly: Story = {
  name: "Title only (no dek)",
  render: () => (
    <HeroStory
      className="max-w-3xl"
      category="Politics"
      title="City council approves record transit budget"
      imageSrc={IMAGE_SRC}
      imageAlt="City council chamber during a public session"
    />
  ),
};

export const SquareAspectRatio: Story = {
  name: "Square aspect ratio",
  render: () => (
    <HeroStory
      className="max-w-md"
      category="Sport"
      title="Underdog club clinches league title on final day"
      imageSrc={IMAGE_SRC}
      imageAlt="A football stadium crowd celebrating"
      aspectRatio="1/1"
    />
  ),
};

export const ComposedAsALink: Story = {
  name: "Composed as a clickable unit",
  render: () => (
    <a
      href="https://example.com/full-story"
      className="block max-w-3xl rounded-lg focus-visible:outline-none"
    >
      <HeroStory
        category="Climate"
        title="Coastal cities race to finish sea walls before hurricane season"
        dek="HeroStory renders no click handler of its own — wrap it in a real link, the same composition pattern Card uses."
        imageSrc={IMAGE_SRC}
        imageAlt="Workers reinforcing a concrete sea wall at sunset"
      />
    </a>
  ),
};

export const HeadingLevelTwo: Story = {
  name: "As the page's own h1",
  render: () => (
    <HeroStory
      className="max-w-3xl"
      category="Special report"
      title="A year after the flood: how one town rebuilt"
      imageSrc={IMAGE_SRC}
      imageAlt="An aerial view of a rebuilt riverside town"
      headingLevel={1}
    />
  ),
};
