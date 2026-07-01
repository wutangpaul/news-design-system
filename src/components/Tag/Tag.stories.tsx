import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Tag } from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  args: {
    children: "Climate",
    onClick: fn(),
    onRemove: fn(),
  },
  argTypes: {
    tone: { control: "select", options: ["neutral", "brand"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Tag {...args} tone="neutral">
        Neutral
      </Tag>
      <Tag {...args} tone="brand">
        Brand
      </Tag>
    </div>
  ),
};

export const Removable: Story = {
  args: { removable: true },
};

export const Interactive: Story = {
  name: "Interactive (filter chip)",
  render: () => {
    function InteractiveDemo() {
      const [selected, setSelected] = useState(false);
      return (
        <Tag interactive selected={selected} onClick={() => setSelected((s) => !s)}>
          Politics
        </Tag>
      );
    }
    return <InteractiveDemo />;
  },
};

export const InteractiveAndRemovable: Story = {
  name: "Interactive + removable",
  render: () => {
    function Demo() {
      const [tags, setTags] = useState(["Politics", "Economy", "Climate"]);
      const [active, setActive] = useState<string | null>(null);
      return (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag
              key={tag}
              interactive
              removable
              selected={active === tag}
              onClick={() => setActive((current) => (current === tag ? null : tag))}
              onRemove={() => setTags((current) => current.filter((t) => t !== tag))}
            >
              {tag}
            </Tag>
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};
