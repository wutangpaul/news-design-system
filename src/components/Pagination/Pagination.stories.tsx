import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    onPageChange: { action: "pageChange" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    return <Pagination page={page} pageCount={5} onPageChange={setPage} />;
  },
};

export const ManyPages: Story = {
  render: function Render() {
    const [page, setPage] = useState(12);
    return <Pagination page={page} pageCount={42} onPageChange={setPage} />;
  },
};

export const AtFirstPage: Story = {
  args: {
    page: 1,
    pageCount: 10,
    onPageChange: () => {},
  },
};

export const AtLastPage: Story = {
  args: {
    page: 10,
    pageCount: 10,
    onPageChange: () => {},
  },
};

export const WiderSiblingWindow: Story = {
  render: function Render() {
    const [page, setPage] = useState(10);
    return <Pagination page={page} pageCount={30} siblingCount={2} onPageChange={setPage} />;
  },
};
