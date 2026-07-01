import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveBlogEntry } from "./LiveBlogEntry";

const meta: Meta<typeof LiveBlogEntry> = {
  title: "Patterns/Editorial/Live Blog Entry",
  component: LiveBlogEntry,
  args: {
    timestamp: "2026-06-30T09:15:00Z",
    title: "Central bank holds interest rates steady",
    children:
      "The committee voted 7-2 to keep the benchmark rate unchanged, citing continued uncertainty over inflation data released earlier this week.",
  },
  argTypes: {
    label: { control: "select", options: [undefined, "breaking", "update"] },
    headingLevel: { control: "select", options: [2, 3, 4, 5, 6] },
  },
};

export default meta;
type Story = StoryObj<typeof LiveBlogEntry>;

export const Default: Story = {};

export const Breaking: Story = {
  args: {
    label: "breaking",
    title: "Prime Minister announces snap election",
  },
};

export const Update: Story = {
  args: {
    label: "update",
    title: "Correction: turnout figures revised",
  },
};

export const Feed: Story = {
  name: "Feed (multiple entries, newest first)",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6">
      <LiveBlogEntry
        timestamp="2026-06-30T09:42:00Z"
        title="Markets rally following the announcement"
        label="update"
      >
        Major indices climbed within minutes of the statement being read.
      </LiveBlogEntry>
      <LiveBlogEntry
        timestamp="2026-06-30T09:15:00Z"
        title="Central bank holds interest rates steady"
        label="breaking"
      >
        The committee voted 7-2 to keep the benchmark rate unchanged.
      </LiveBlogEntry>
      <LiveBlogEntry timestamp="2026-06-30T08:50:00Z" title="Statement expected within the hour">
        Reporters have gathered outside the central bank&apos;s headquarters ahead of this
        morning&apos;s rate decision.
      </LiveBlogEntry>
    </div>
  ),
};
