import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryNavigation, type CategoryNavItem } from "./CategoryNavigation";

const items: CategoryNavItem[] = [
  { label: "World", href: "/world" },
  { label: "Politics", href: "/politics", current: true },
  { label: "Business", href: "/business" },
  { label: "Technology", href: "/technology" },
  { label: "Sports", href: "/sports" },
  { label: "Culture", href: "/culture" },
];

const meta: Meta<typeof CategoryNavigation> = {
  title: "Patterns/Editorial/Category Navigation",
  component: CategoryNavigation,
  args: { items },
};

export default meta;
type Story = StoryObj<typeof CategoryNavigation>;

export const Default: Story = {};

export const NarrowViewport: Story = {
  name: "Narrow viewport (scrolls horizontally)",
  render: (args) => (
    <div className="max-w-xs">
      <CategoryNavigation {...args} />
    </div>
  ),
};

export const CustomAriaLabel: Story = {
  name: "Custom aria-label",
  args: { ariaLabel: "News sections" },
};
