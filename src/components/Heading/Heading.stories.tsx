import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
  args: {
    level: 2,
    children: "Central bank signals pause in rate increases",
  },
  argTypes: {
    level: { control: "select", options: [1, 2, 3, 4, 5, 6] },
    visualSize: { control: "select", options: [1, 2, 3, 4, 5, 6, "display"] },
    weight: { control: "select", options: ["regular", "medium", "semibold", "bold"] },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

export const AllLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
      <Heading level={5}>Heading level 5</Heading>
      <Heading level={6}>Heading level 6</Heading>
    </div>
  ),
};

export const DecoupledVisualSize: Story = {
  name: "Decoupled visual size",
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading level={2} visualSize={4}>
        Semantic h2, styled like the h4 scale (e.g. a dense rail headline)
      </Heading>
      <Heading level={4} visualSize={1}>
        Semantic h4, styled like the h1/display scale (e.g. a hero card deep in the
        document outline)
      </Heading>
    </div>
  ),
};

export const Display: Story = {
  args: { level: 1, visualSize: "display" },
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading level={3} weight="regular">
        Regular weight
      </Heading>
      <Heading level={3} weight="medium">
        Medium weight
      </Heading>
      <Heading level={3} weight="semibold">
        Semibold weight
      </Heading>
      <Heading level={3} weight="bold">
        Bold weight
      </Heading>
    </div>
  ),
};
