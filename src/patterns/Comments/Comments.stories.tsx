import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Comments, type CommentData } from "./Comments";

const sampleComments: CommentData[] = [
  {
    id: "c1",
    author: { name: "Jordan Reyes" },
    timestamp: "2026-06-29T14:32:00Z",
    body: "This is a really thorough breakdown — appreciate the context on the earlier ruling.",
    replies: [
      {
        id: "c1-r1",
        author: { name: "Priya Nair" },
        timestamp: "2026-06-29T14:48:00Z",
        body: "Agreed, the timeline graphic especially helped.",
      },
    ],
  },
  {
    id: "c2",
    author: { name: "Sam Okafor" },
    timestamp: "2026-06-29T15:10:00Z",
    body: "Any update on how this affects the smaller markets mentioned in paragraph three?",
  },
];

const meta: Meta<typeof Comments> = {
  title: "Patterns/Editorial/Comments",
  component: Comments,
  args: {
    comments: sampleComments,
    onReply: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Comments>;

export const Default: Story = {};

export const WithoutComposer: Story = {
  name: "Without composer (read-only)",
  args: { onSubmit: undefined },
};

export const WithoutReply: Story = {
  name: "Without reply action",
  args: { onReply: undefined },
};

export const Empty: Story = {
  args: { comments: [] },
};
