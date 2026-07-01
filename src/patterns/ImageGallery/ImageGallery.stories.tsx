import type { Meta, StoryObj } from "@storybook/react";
import { ImageGallery } from "./ImageGallery";

const images = [
  {
    src: "https://picsum.photos/seed/gallery-1/960/540",
    alt: "Marchers holding signs on Main Street",
    caption: "Marchers gather downtown ahead of Tuesday's rally.",
    credit: "Jane Doe/Wire Service",
  },
  {
    src: "https://picsum.photos/seed/gallery-2/960/540",
    alt: "A speaker addressing the crowd from a small stage",
    caption: "Organizers addressed the crowd shortly after noon.",
    credit: "Sam Lee/Wire Service",
  },
  {
    src: "https://picsum.photos/seed/gallery-3/960/540",
    alt: "Police officers standing along the parade route",
    caption: "Officers monitored the route for the duration of the march.",
  },
];

const meta = {
  title: "Patterns/Editorial/Image Gallery",
  component: ImageGallery,
  parameters: {
    layout: "padded",
  },
  args: {
    images,
    label: "Photos from Tuesday's downtown rally",
  },
  render: (args) => (
    <div className="max-w-2xl">
      <ImageGallery {...args} />
    </div>
  ),
} satisfies Meta<typeof ImageGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    aspectRatio: "16/9",
  },
};

export const SingleImage: Story = {
  name: "Single image (no nav controls)",
  args: {
    images: [images[0]],
    aspectRatio: "16/9",
  },
};

export const StartingAtSecondImage: Story = {
  name: "Starting at the second image",
  args: {
    defaultIndex: 1,
    aspectRatio: "16/9",
  },
};

export const NotEnlargeable: Story = {
  name: "Enlarge disabled",
  args: {
    enlargeable: false,
    aspectRatio: "16/9",
  },
};
