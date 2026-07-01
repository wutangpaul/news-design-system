import type { Meta, StoryObj } from "@storybook/react-vite";
import { PodcastCards, type PodcastCardItem } from "./PodcastCards";

const meta = {
  title: "Patterns/Content Discovery/Podcast Cards",
  component: PodcastCards,
} satisfies Meta<typeof PodcastCards>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleEpisodes: PodcastCardItem[] = [
  {
    id: "1",
    show: "The Daily Brief",
    title: "What the jobs report really tells us",
    href: "https://example.com/podcasts/jobs-report",
    duration: "28:41",
    artworkSrc: "https://picsum.photos/seed/podcast-1/200/200",
    artworkAlt: "The Daily Brief show artwork",
  },
  {
    id: "2",
    show: "Deep Dive",
    title: "The engineers racing to save the coastline",
    href: "https://example.com/podcasts/coastline",
    duration: "41:12",
    artworkSrc: "https://picsum.photos/seed/podcast-2/200/200",
    artworkAlt: "Deep Dive show artwork",
  },
  {
    id: "3",
    show: "On Background",
    title: "Inside the negotiations, off the record",
    href: "https://example.com/podcasts/off-the-record",
    duration: "35:07",
  },
];

export const Default: Story = {
  args: {
    episodes: sampleEpisodes,
  },
};

export const WithoutArtwork: Story = {
  name: "Without artwork (waveform placeholder)",
  args: {
    episodes: sampleEpisodes.filter((episode) => !episode.artworkSrc),
  },
};

export const CustomTitle: Story = {
  name: "Custom section title",
  args: {
    title: "Listen: This week's episodes",
    episodes: sampleEpisodes,
  },
};

export const Empty: Story = {
  name: "Empty state",
  args: {
    episodes: [],
  },
};
