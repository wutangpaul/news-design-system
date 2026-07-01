import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer, type DrawerSide } from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    side: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

function DrawerDemo({ side }: { side?: DrawerSide }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-[420px] items-center justify-center p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-masthead-500 px-4 py-2 text-small font-semibold text-text-on-brand"
      >
        Open {side ?? "right"} drawer
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filter articles"
        description="Narrow results by section, date, and author."
        side={side}
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-small font-semibold">Section</legend>
          {["World", "Business", "Culture", "Opinion"].map((section) => (
            <label key={section} className="flex items-center gap-2 text-small">
              <input type="checkbox" />
              {section}
            </label>
          ))}
        </fieldset>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md bg-masthead-500 px-3 py-1.5 text-small font-medium text-text-on-brand"
          >
            Apply filters
          </button>
        </div>
      </Drawer>
    </div>
  );
}

export const Default: Story = {
  render: () => <DrawerDemo />,
};

export const Left: Story = {
  render: () => <DrawerDemo side="left" />,
};

export const Top: Story = {
  render: () => <DrawerDemo side="top" />,
};

export const Bottom: Story = {
  render: () => <DrawerDemo side="bottom" />,
};

export const DarkMode: Story = {
  render: () => <DrawerDemo />,
  globals: { theme: "dark" },
};
