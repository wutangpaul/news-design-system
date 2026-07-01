import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal, type ModalSize } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "fullscreen"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalDemo({ size }: { size?: ModalSize }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-[420px] items-center justify-center p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-masthead-500 px-4 py-2 text-small font-semibold text-text-on-brand"
      >
        Open modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete article"
        description="This action cannot be undone."
        size={size}
      >
        <p className="text-small text-text-secondary">
          The draft and all of its revision history will be permanently removed.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-surface-border px-3 py-1.5 text-small font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md bg-error-500 px-3 py-1.5 text-small font-medium text-text-on-brand"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const Small: Story = {
  render: () => <ModalDemo size="sm" />,
};

export const Large: Story = {
  render: () => <ModalDemo size="lg" />,
};

export const Fullscreen: Story = {
  render: () => <ModalDemo size="fullscreen" />,
};

export const DarkMode: Story = {
  render: () => <ModalDemo />,
  globals: { theme: "dark" },
};
