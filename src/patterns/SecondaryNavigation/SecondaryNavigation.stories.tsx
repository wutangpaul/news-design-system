import type { Meta, StoryObj } from "@storybook/react-vite";
import { SecondaryNavigation } from "./SecondaryNavigation";

const meta = {
  title: "Patterns/Navigation/Secondary Navigation",
  component: SecondaryNavigation,
  parameters: {
    layout: "padded",
  },
  args: {
    items: [
      { label: "Africa", href: "/world/africa" },
      { label: "Americas", href: "/world/americas", current: true },
      { label: "Asia", href: "/world/asia" },
      { label: "Europe", href: "/world/europe" },
      { label: "Middle East", href: "/world/middle-east" },
    ],
  },
} satisfies Meta<typeof SecondaryNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 12 }, (_, index) => ({
      label: `Section ${index + 1}`,
      href: `/section-${index + 1}`,
      current: index === 0,
    })),
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
