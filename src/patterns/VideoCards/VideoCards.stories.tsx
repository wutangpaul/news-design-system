import type { Meta, StoryObj } from "@storybook/react";
import { VideoCards, type VideoCardItem } from "./VideoCards";

const meta = {
  title: "Patterns/Content Discovery/Video Cards",
  component: VideoCards,
} satisfies Meta<typeof VideoCards>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleVideos: VideoCardItem[] = [
  {
    id: "1",
    title: "Inside the newsroom on election night",
    href: "https://example.com/videos/election-night",
    thumbnailSrc: "https://picsum.photos/seed/video-1/640/360",
    thumbnailAlt: "Editors gathered around a bank of monitors on election night",
    duration: "4:32",
  },
  {
    id: "2",
    title: "How wildfire smoke is tracked from space",
    href: "https://example.com/videos/wildfire-smoke",
    thumbnailSrc: "https://picsum.photos/seed/video-2/640/360",
    thumbnailAlt: "A satellite image of wildfire smoke drifting across a coastline",
    duration: "6:18",
  },
  {
    id: "3",
    title: "A day with the harbor pilots guiding container ships",
    href: "https://example.com/videos/harbor-pilots",
    thumbnailSrc: "https://picsum.photos/seed/video-3/640/360",
    thumbnailAlt: "A harbor pilot climbing a rope ladder onto a container ship",
    duration: "9:47",
  },
  {
    id: "4",
    title: "The last print run at a century-old newspaper",
    href: "https://example.com/videos/last-print-run",
    thumbnailSrc: "https://picsum.photos/seed/video-4/640/360",
    thumbnailAlt: "A printing press running its final edition",
    duration: "3:05",
  },
];

export const Default: Story = {
  args: {
    videos: sampleVideos,
  },
};

export const CustomTitle: Story = {
  name: "Custom section title",
  args: {
    title: "Watch: Today's top videos",
    videos: sampleVideos.slice(0, 2),
  },
};

export const Empty: Story = {
  name: "Empty state",
  args: {
    videos: [],
  },
};
