import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLink, Bookmark } from "@/components/Icon";
import { SocialSharing, type SocialSharePlatform } from "./SocialSharing";

const examplePlatforms: SocialSharePlatform[] = [
  {
    id: "x",
    label: "Share on X",
    // Stand-in icon for the story — a real integration would supply its own
    // brand mark here; this design system's curated icon set intentionally
    // has no social-network logos (see the MDX for why).
    icon: <ExternalLink size="sm" />,
    onShare: () => {},
  },
  {
    id: "save",
    label: "Save for later",
    icon: <Bookmark size="sm" />,
    onShare: () => {},
  },
];

const meta = {
  title: "Patterns/Editorial/Social Sharing",
  component: SocialSharing,
  parameters: {
    layout: "padded",
  },
  args: {
    url: "https://example.com/articles/city-council-approves-transit-overhaul",
    title: "City council approves downtown transit overhaul",
  },
} satisfies Meta<typeof SocialSharing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlatformButtons: Story = {
  name: "With platform-specific buttons",
  args: {
    platforms: examplePlatforms,
  },
};

export const WithFallbackShareHandler: Story = {
  name: "With a fallback for browsers without the Web Share API",
  args: {
    onShare: () => {
      // Browsers without navigator.share (or that reject the call) fall
      // back to this — e.g. open your own share sheet/modal.
    },
  },
};
