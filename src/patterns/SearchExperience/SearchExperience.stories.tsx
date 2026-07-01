import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SearchExperience } from "./SearchExperience";

const meta = {
  title: "Patterns/Navigation/Search Experience",
  component: SearchExperience,
  parameters: {
    layout: "padded",
  },
  args: {
    onSearch: fn(),
  },
} satisfies Meta<typeof SearchExperience>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Search 20 years of archives",
  },
};

export const DarkMode: Story = {
  globals: { theme: "dark" },
};
