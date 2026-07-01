import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTab, TabsPanel } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="world">
      <TabsList aria-label="News sections">
        <TabsTab value="world">World</TabsTab>
        <TabsTab value="business">Business</TabsTab>
        <TabsTab value="culture">Culture</TabsTab>
      </TabsList>
      <TabsPanel value="world">
        <p className="text-text-secondary">
          Coverage of international affairs, diplomacy, and global events.
        </p>
      </TabsPanel>
      <TabsPanel value="business">
        <p className="text-text-secondary">Markets, companies, and the economy.</p>
      </TabsPanel>
      <TabsPanel value="culture">
        <p className="text-text-secondary">Film, books, art, and ideas.</p>
      </TabsPanel>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="world">
      <TabsList aria-label="News sections">
        <TabsTab value="world">World</TabsTab>
        <TabsTab value="business" disabled>
          Business (unavailable)
        </TabsTab>
        <TabsTab value="culture">Culture</TabsTab>
      </TabsList>
      <TabsPanel value="world">
        <p className="text-text-secondary">World coverage.</p>
      </TabsPanel>
      <TabsPanel value="business">
        <p className="text-text-secondary">Business coverage.</p>
      </TabsPanel>
      <TabsPanel value="culture">
        <p className="text-text-secondary">Culture coverage.</p>
      </TabsPanel>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="world" orientation="vertical">
      <TabsList aria-label="News sections">
        <TabsTab value="world">World</TabsTab>
        <TabsTab value="business">Business</TabsTab>
        <TabsTab value="culture">Culture</TabsTab>
      </TabsList>
      <TabsPanel value="world">
        <p className="text-text-secondary">World coverage.</p>
      </TabsPanel>
      <TabsPanel value="business">
        <p className="text-text-secondary">Business coverage.</p>
      </TabsPanel>
      <TabsPanel value="culture">
        <p className="text-text-secondary">Culture coverage.</p>
      </TabsPanel>
    </Tabs>
  ),
};
