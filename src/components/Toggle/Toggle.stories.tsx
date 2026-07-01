import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const ViewSwitcher: Story = {
  render: () => {
    const [value, setValue] = useState("article");
    return (
      <Toggle
        aria-label="View"
        options={[
          { label: "Article", value: "article" },
          { label: "Photos", value: "photos" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const ThreeOptions: Story = {
  render: () => {
    const [value, setValue] = useState("grid");
    return (
      <Toggle
        aria-label="Layout"
        options={[
          { label: "List", value: "list" },
          { label: "Grid", value: "grid" },
          { label: "Magazine", value: "magazine" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const MultiSelectFilterChips: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["sports"]);
    return (
      <Toggle
        aria-label="Filter by section"
        type="multiple"
        options={[
          { label: "Sports", value: "sports" },
          { label: "Politics", value: "politics" },
          { label: "Culture", value: "culture" },
          { label: "Opinion", value: "opinion" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const options = [
      { label: "Article", value: "article" },
      { label: "Photos", value: "photos" },
    ];
    return (
      <div className="flex flex-col items-start gap-4">
        <Toggle aria-label="Small" size="sm" options={options} value="article" onChange={() => {}} />
        <Toggle aria-label="Medium" size="md" options={options} value="article" onChange={() => {}} />
        <Toggle aria-label="Large" size="lg" options={options} value="article" onChange={() => {}} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Toggle
      aria-label="View"
      options={[
        { label: "Article", value: "article" },
        { label: "Photos", value: "photos" },
      ]}
      value="article"
      onChange={() => {}}
      disabled
    />
  ),
};

export const OneOptionDisabled: Story = {
  render: () => (
    <Toggle
      aria-label="View"
      options={[
        { label: "Article", value: "article" },
        { label: "Photos", value: "photos" },
        { label: "Video (unavailable)", value: "video", disabled: true },
      ]}
      value="article"
      onChange={() => {}}
    />
  ),
};
