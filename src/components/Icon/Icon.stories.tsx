import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import {
  Close,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Menu,
  Share,
  Bookmark,
  ArrowRight,
  ExternalLink,
} from "./icons";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  args: {
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  render: (args) => (
    <Icon {...args}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Icon>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-text-primary">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <Search size={size} />
          <span className="text-caption text-text-tertiary">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Labeled: Story = {
  name: "With accessible label",
  render: () => <Bookmark label="Save article" className="text-masthead-500" />,
};

export const CuratedSet: Story = {
  name: "Curated icon set",
  render: () => {
    const icons = [
      { name: "Close", Cmp: Close },
      { name: "ChevronDown", Cmp: ChevronDown },
      { name: "ChevronRight", Cmp: ChevronRight },
      { name: "ChevronLeft", Cmp: ChevronLeft },
      { name: "Search", Cmp: Search },
      { name: "Menu", Cmp: Menu },
      { name: "Share", Cmp: Share },
      { name: "Bookmark", Cmp: Bookmark },
      { name: "ArrowRight", Cmp: ArrowRight },
      { name: "ExternalLink", Cmp: ExternalLink },
    ];
    return (
      <div className="grid grid-cols-5 gap-6 text-text-primary">
        {icons.map(({ name, Cmp }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <Cmp size="lg" />
            <span className="text-caption text-text-tertiary">{name}</span>
          </div>
        ))}
      </div>
    );
  },
};
