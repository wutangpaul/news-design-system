import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
  args: {
    title: "Heads up",
    children: "Your draft was saved automatically 2 minutes ago.",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: { variant: "info" },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "New section available",
    children: "Climate coverage now has its own dedicated section.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Published",
    children: "Your article is now live on the homepage.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Unsaved changes",
    children: "This draft has edits that haven't been published yet.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Publish failed",
    children: "We couldn't publish this article. Check your connection and try again.",
  },
};

export const Dismissible: Story = {
  args: {
    variant: "warning",
    title: "Embargo active",
    children: "This article is scheduled and won't be visible to readers until 6:00am ET.",
    dismissible: true,
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: "info",
    title: undefined,
    children: "Autosave is on — changes are saved as you type.",
  },
};

export const DarkMode: Story = {
  args: { variant: "success", title: "Published", children: "Your article is now live." },
  globals: { theme: "dark" },
};
