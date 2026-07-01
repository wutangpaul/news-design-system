import type { Meta, StoryObj } from "@storybook/react";
import { Image } from "./Image";

const meta = {
  title: "Components/Image",
  component: Image,
  parameters: {
    layout: "padded",
  },
  args: {
    src: "https://picsum.photos/seed/news-design-system/960/540",
    alt: "Aerial view of a city skyline at dusk",
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Image {...args} />
    </div>
  ),
};

export const AspectRatio16x9: Story = {
  name: "Aspect ratio — 16/9",
  render: (args) => (
    <div className="max-w-md">
      <Image {...args} aspectRatio="16/9" />
    </div>
  ),
};

export const AspectRatio1x1: Story = {
  name: "Aspect ratio — 1/1",
  render: (args) => (
    <div className="max-w-xs">
      <Image {...args} aspectRatio="1/1" />
    </div>
  ),
};

export const AspectRatio4x3: Story = {
  name: "Aspect ratio — 4/3",
  render: (args) => (
    <div className="max-w-sm">
      <Image {...args} aspectRatio="4/3" />
    </div>
  ),
};

export const Loading: Story = {
  name: "Loading (shimmer placeholder)",
  render: (args) => (
    <div className="max-w-md">
      <Image {...args} src="https://example.invalid/never-resolves.jpg" aspectRatio="16/9" />
    </div>
  ),
};

export const ErrorFallback: Story = {
  name: "Error fallback",
  render: (args) => (
    <div className="max-w-md">
      <Image
        {...args}
        src="https://example.invalid/broken-image.jpg"
        alt="Photo of the newsroom (failed to load)"
        aspectRatio="16/9"
      />
    </div>
  ),
};

export const Decorative: Story = {
  name: "Decorative (empty alt)",
  render: (args) => (
    <div className="max-w-md">
      <Image {...args} alt="" aspectRatio="21/9" />
    </div>
  ),
};
