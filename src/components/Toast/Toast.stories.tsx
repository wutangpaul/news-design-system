import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "./Toast";
import { ToastProvider } from "./ToastProvider";
import { ToastViewport } from "./ToastViewport";
import { useToast } from "./useToast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
  args: {
    title: "Saved",
    description: "Your draft was saved.",
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: { variant: "info" },
};

export const Success: Story = {
  args: { variant: "success", title: "Published", description: "Your article is now live." },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Slow connection",
    description: "Changes may take longer than usual to save.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Publish failed",
    description: "Check your connection and try again.",
  },
};

export const WithoutDescription: Story = {
  args: { variant: "success", title: "Copied to clipboard", description: undefined },
};

export const DarkMode: Story = {
  args: { variant: "success", title: "Published", description: "Your article is now live." },
  globals: { theme: "dark" },
};

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex min-h-[320px] flex-wrap items-center justify-center gap-2 p-8">
      <button
        type="button"
        className="rounded-md border border-surface-border bg-surface-raised px-3 py-1.5 text-small font-medium"
        onClick={() => toast({ title: "Saved", description: "Your draft was saved.", variant: "info" })}
      >
        Show info toast
      </button>
      <button
        type="button"
        className="rounded-md border border-surface-border bg-surface-raised px-3 py-1.5 text-small font-medium"
        onClick={() => toast({ title: "Published", description: "Your article is now live.", variant: "success" })}
      >
        Show success toast
      </button>
      <button
        type="button"
        className="rounded-md border border-surface-border bg-surface-raised px-3 py-1.5 text-small font-medium"
        onClick={() =>
          toast({
            title: "Publish failed",
            description: "Check your connection and try again.",
            variant: "error",
            duration: 8000,
          })
        }
      >
        Show error toast
      </button>
      <p className="w-full text-center text-caption text-text-tertiary">
        Hover or focus a toast to pause its auto-dismiss timer.
      </p>
    </div>
  );
}

export const LiveDemo: Story = {
  name: "Live demo (useToast + ToastViewport)",
  render: () => (
    <ToastProvider>
      <ToastDemo />
      <ToastViewport />
    </ToastProvider>
  ),
};
