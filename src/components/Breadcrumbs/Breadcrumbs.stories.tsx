import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "World", href: "/world" },
      { label: "Europe", href: "/world/europe" },
      { label: "Article headline goes here" },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Business" },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Culture", href: "/culture" },
      { label: "Film reviews" },
    ],
    separator: "/",
  },
};
