import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSeparator } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>Sort by</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => alert("Newest first")}>Newest first</DropdownItem>
        <DropdownItem onSelect={() => alert("Oldest first")}>Oldest first</DropdownItem>
        <DropdownItem onSelect={() => alert("Most read")}>Most read</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithSeparatorAndDisabledItem: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>Article actions</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => alert("Share")}>Share</DropdownItem>
        <DropdownItem onSelect={() => alert("Save")}>Save for later</DropdownItem>
        <DropdownSeparator />
        <DropdownItem disabled>Retract (unavailable)</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const AlignedEnd: Story = {
  render: () => (
    <div className="flex justify-end">
      <Dropdown>
        <DropdownTrigger>Options</DropdownTrigger>
        <DropdownMenu align="end">
          <DropdownItem onSelect={() => {}}>Edit</DropdownItem>
          <DropdownItem onSelect={() => {}}>Duplicate</DropdownItem>
          <DropdownItem onSelect={() => {}}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
};

export const CustomTriggerContent: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger aria-label="User menu">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-masthead-500 text-small font-semibold text-text-on-brand">
          PM
        </span>
      </DropdownTrigger>
      <DropdownMenu align="end">
        <DropdownItem onSelect={() => {}}>Profile</DropdownItem>
        <DropdownItem onSelect={() => {}}>Settings</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={() => {}}>Sign out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};
