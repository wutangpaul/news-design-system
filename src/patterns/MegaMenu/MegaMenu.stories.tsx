import type { Meta, StoryObj } from "@storybook/react-vite";
import { MegaMenu } from "./MegaMenu";

const meta = {
  title: "Patterns/Navigation/Mega Menu",
  component: MegaMenu,
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Politics",
    columns: [
      {
        heading: "Coverage",
        links: [
          { label: "Elections", href: "/politics/elections" },
          { label: "Congress", href: "/politics/congress" },
          { label: "White House", href: "/politics/white-house" },
          { label: "Supreme Court", href: "/politics/supreme-court" },
        ],
      },
      {
        heading: "States",
        links: [
          { label: "State Policy", href: "/politics/states/policy" },
          { label: "Governors", href: "/politics/states/governors" },
          { label: "Ballot Measures", href: "/politics/states/ballot-measures" },
        ],
      },
    ],
  },
} satisfies Meta<typeof MegaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFeatured: Story = {
  args: {
    featured: {
      eyebrow: "Featured",
      label: "Inside the final days of the campaign",
      href: "/politics/features/final-days",
      description: "A behind-the-scenes look at the last 72 hours before election day.",
    },
  },
};

export const ManyColumns: Story = {
  args: {
    label: "World",
    columns: [
      {
        heading: "Regions",
        links: [
          { label: "Africa", href: "/world/africa" },
          { label: "Americas", href: "/world/americas" },
          { label: "Asia", href: "/world/asia" },
        ],
      },
      {
        heading: "Topics",
        links: [
          { label: "Conflict", href: "/world/conflict" },
          { label: "Climate", href: "/world/climate" },
          { label: "Migration", href: "/world/migration" },
        ],
      },
      {
        heading: "Series",
        links: [
          { label: "Dispatches", href: "/world/dispatches" },
          { label: "The Long Read", href: "/world/long-read" },
        ],
      },
    ],
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
